import { assert, assertEquals, assertThrows } from "jsr:@std/assert";
import geoToBlender from "../../src/geo/geoToBlender.ts";
import geoToBlenderPoint from "../../src/geo/geoToBlenderPoint.ts";

const outputDir = "test/output/geoToBlenderPoint";
const provincesPath = "test/data/lpr_000b21a_e.json";

const square = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-1, -1],
          [1, -1],
          [1, 1],
          [-1, 1],
          [-1, -1],
        ]],
      },
    },
  ],
};

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
    scale: 1,
    decimals: 3,
  });

  assertEquals(point, { x: -0.017, y: -0.017, z: 1 });
});

Deno.test("should return a Blender point as an array", () => {
  const point = geoToBlenderPoint(-1, -1, "orthographic", {
    scale: 1,
    decimals: 3,
    toArray: true,
  });

  assertEquals(point, [-0.017, -0.017, 1]);
});

Deno.test("should fit flat projections to GeoJSON before converting coordinates", async () => {
  const geojsonPath = await writeGeoJson("square");
  const outputPath = `${outputDir}/square.obj`;

  await geoToBlender(geojsonPath, "mercator", outputPath, {
    scale: 10,
    decimals: 3,
  });

  const obj = await Deno.readTextFile(outputPath);
  const point = geoToBlenderPoint(-1, -1, "mercator", {
    fitTo: square,
    scale: 10,
    decimals: 3,
    toArray: true,
  });

  assertEquals(point, firstVertex(obj));
});

Deno.test("should place flat projection points on Blender's X/Y plane", () => {
  const point = geoToBlenderPoint(-1, -1, "mercator", {
    fitTo: square,
    scale: 10,
    decimals: 3,
  });

  assertEquals(point, { x: -5, y: 5, z: 0 });
});

Deno.test("should place Canada points inside flat Blender boundary extents", async () => {
  await Deno.mkdir(outputDir, { recursive: true });
  const outputPath = `${outputDir}/canada-provinces-territories.obj`;

  await geoToBlender(provincesPath, "mercator", outputPath, {
    scale: 10,
    decimals: 3,
  });

  const canadaGeoJson = JSON.parse(await Deno.readTextFile(provincesPath));
  const obj = await Deno.readTextFile(outputPath);
  const bounds = vertexBounds(obj);
  const point = geoToBlenderPoint(-75.6972, 45.4215, "mercator", {
    fitTo: canadaGeoJson,
    scale: 10,
    decimals: 3,
  });

  assertEquals(bounds.minZ, 0);
  assertEquals(bounds.maxZ, 0);
  assertEquals(point.z, 0);
  assert(point.x >= bounds.minX && point.x <= bounds.maxX);
  assert(point.y >= bounds.minY && point.y <= bounds.maxY);
});

Deno.test("should require fitTo for flat projections", () => {
  assertThrows(
    () => geoToBlenderPoint(-1, -1, "mercator"),
    Error,
    "options.fitTo",
  );
});

Deno.test("should throw when a flat projection cannot project the coordinate", () => {
  assertThrows(
    () =>
      geoToBlenderPoint(-1, -1, "albersUsa", {
        fitTo: square,
        scale: 10,
      }),
    Error,
    "could not project coordinate [-1, -1]",
  );
});
