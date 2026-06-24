import { assert, assertEquals, assertThrows } from "jsr:@std/assert";
import { geoAlbersUsa, geoMercator } from "d3-geo";
import geoToBlender from "../../src/geo/geoToBlender.ts";
import geoToBlenderPoint from "../../src/geo/geoToBlenderPoint.ts";
import {
  type GeoJsonObject,
  getLines,
} from "../../src/geo/helpers/blenderProjection.ts";

const outputDir = "test/output/geoToBlenderPoint";
const provincesPath = "test/data/lpr_000b21a_e.json";

const squareCoordinates: [number, number][][] = [[
  [-1, -1],
  [1, -1],
  [1, 1],
  [-1, 1],
  [-1, -1],
]];

const square = {
  type: "FeatureCollection" as const,
  features: [
    {
      type: "Feature" as const,
      properties: {},
      geometry: {
        type: "Polygon" as const,
        coordinates: squareCoordinates,
      },
    },
  ],
};

function fitSquareProjection() {
  return geoMercator().fitExtent([[-5, -5], [5, 5]], {
    type: "MultiLineString",
    coordinates: getLines(square),
  });
}

async function writeGeoJson(name: string): Promise<string> {
  await Deno.mkdir(outputDir, { recursive: true });
  const path = `${outputDir}/${name}.geojson`;
  await Deno.writeTextFile(path, JSON.stringify(square));
  return path;
}

function firstVertex(obj: string): [number, number, number] {
  const line = obj.split("\n").find((line) => line.startsWith("v "));

  if (!line) {
    throw new Error("OBJ output does not include vertices.");
  }

  const [, x, y, z] = line.split(" ");
  return [Number(x), Number(y), Number(z)];
}

function vertexBounds(obj: string): {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  minZ: number;
  maxZ: number;
} {
  const bounds = {
    minX: Infinity,
    maxX: -Infinity,
    minY: Infinity,
    maxY: -Infinity,
    minZ: Infinity,
    maxZ: -Infinity,
  };

  for (const line of obj.split("\n")) {
    if (!line.startsWith("v ")) {
      continue;
    }

    const [, xValue, yValue, zValue] = line.split(" ").map(Number);
    bounds.minX = Math.min(bounds.minX, xValue);
    bounds.maxX = Math.max(bounds.maxX, xValue);
    bounds.minY = Math.min(bounds.minY, yValue);
    bounds.maxY = Math.max(bounds.maxY, yValue);
    bounds.minZ = Math.min(bounds.minZ, zValue);
    bounds.maxZ = Math.max(bounds.maxZ, zValue);
  }

  return bounds;
}

Deno.test("should convert orthographic coordinates to a Blender point", () => {
  const point = geoToBlenderPoint(-1, -1, "orthographic", {
    radius: 1,
    decimals: 3,
  });

  assertEquals(point, { x: -0.017, y: -0.017, z: 1 });
});

Deno.test("should return a Blender point as an array", () => {
  const point = geoToBlenderPoint(-1, -1, "orthographic", {
    radius: 1,
    decimals: 3,
    toArray: true,
  });

  assertEquals(point, [-0.017, -0.017, 1]);
});

Deno.test("should convert coordinates with a fitted flat projection", async () => {
  const geojsonPath = await writeGeoJson("square");
  const outputPath = `${outputDir}/square.obj`;

  await geoToBlender(geojsonPath, fitSquareProjection(), outputPath, {
    decimals: 3,
  });

  const obj = await Deno.readTextFile(outputPath);
  const point = geoToBlenderPoint(-1, -1, fitSquareProjection(), {
    decimals: 3,
    toArray: true,
  });

  assertEquals(point, firstVertex(obj));
});

Deno.test("should place flat projection points on Blender's X/Y plane", () => {
  const point = geoToBlenderPoint(-1, -1, fitSquareProjection(), {
    decimals: 3,
  });

  assertEquals(point, { x: -5, y: -5, z: 0 });
});

Deno.test("should convert points with a pre-fitted flat projection", () => {
  const projection = fitSquareProjection();
  const point = geoToBlenderPoint(-1, -1, projection, {
    decimals: 3,
    toArray: true,
  });

  assertEquals(point, [-5, -5, 0]);
});

Deno.test("should place northern flat projection points above southern points", () => {
  const projection = fitSquareProjection();
  const south = geoToBlenderPoint(0, -1, projection);
  const north = geoToBlenderPoint(0, 1, projection);

  assert(north.y > south.y);
});

Deno.test("should place Canada points inside flat Blender boundary extents", async () => {
  await Deno.mkdir(outputDir, { recursive: true });
  const outputPath = `${outputDir}/canada-provinces-territories.obj`;

  const canadaGeoJson = JSON.parse(
    await Deno.readTextFile(provincesPath),
  ) as GeoJsonObject;
  const projection = geoMercator().fitExtent([[-5, -5], [5, 5]], {
    type: "MultiLineString",
    coordinates: getLines(canadaGeoJson),
  });
  await geoToBlender(provincesPath, projection, outputPath, {
    decimals: 3,
  });
  const obj = await Deno.readTextFile(outputPath);
  const bounds = vertexBounds(obj);
  const point = geoToBlenderPoint(-75.6972, 45.4215, projection, {
    decimals: 3,
  });

  assertEquals(bounds.minZ, 0);
  assertEquals(bounds.maxZ, 0);
  assertEquals(point.z, 0);
  assert(point.x >= bounds.minX && point.x <= bounds.maxX);
  assert(point.y >= bounds.minY && point.y <= bounds.maxY);
});

Deno.test("should throw when a flat projection cannot project the coordinate", () => {
  const projection = geoAlbersUsa().fitExtent([[-5, -5], [5, 5]], {
    type: "MultiLineString",
    coordinates: getLines(square),
  });

  assertThrows(
    () => geoToBlenderPoint(-1, -1, projection),
    Error,
    "could not project coordinate [-1, -1]",
  );
});
