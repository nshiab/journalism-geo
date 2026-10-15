import { mkdir, mkdtemp, readFile, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test, afterAll, expect } from "vite-plus/test";
import { ok as assert, deepStrictEqual as assertEquals } from "node:assert/strict";
import { geoAlbersUsa, geoConicConformal, geoMercator } from "d3-geo";
import geoToBlender from "../../src/geo/geoToBlender.ts";
import geoToBlenderPoint from "../../src/geo/geoToBlenderPoint.ts";
import rewind from "../../src/geo/rewind.ts";
import {
  type GeoJsonObject,
  type GeoJsonGeometry,
  getLines,
  parseGeoJson,
} from "../../src/geo/helpers/blenderProjection.ts";

const outputDir = await mkdtemp(join(tmpdir(), "journalism-geoToBlenderPoint-"));
afterAll(() => rm(outputDir, { recursive: true, force: true }));
const provincesPath = "test/data/lpr_000b21a_e.json";

const squareCoordinates: [number, number][][] = [
  [
    [-1, -1],
    [1, -1],
    [1, 1],
    [-1, 1],
    [-1, -1],
  ],
];

const square: GeoJsonObject = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
        coordinates: squareCoordinates,
      },
    },
  ],
};

function fitSquareProjection() {
  return geoMercator().fitExtent(
    [
      [-5, -5],
      [5, 5],
    ],
    {
      type: "MultiLineString",
      coordinates: getLines(square),
    },
  );
}

async function writeGeoJson(name: string): Promise<string> {
  await mkdir(outputDir, { recursive: true });
  const path = `${outputDir}/${name}.geojson`;
  await writeFile(path, JSON.stringify(square));
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

test("should convert orthographic coordinates to a Blender point", () => {
  const point = geoToBlenderPoint(-1, -1, "orthographic", {
    radius: 1,
    decimals: 3,
  });

  assertEquals(point, { x: -0.017, y: -0.017, z: 1 });
});

test("should return a Blender point as an array", () => {
  const point = geoToBlenderPoint(-1, -1, "orthographic", {
    radius: 1,
    decimals: 3,
    toArray: true,
  });

  assertEquals(point, [-0.017, -0.017, 1]);
});

test("should convert coordinates with a fitted flat projection", async () => {
  const geojsonPath = await writeGeoJson("square");
  const outputPath = `${outputDir}/square.obj`;

  await geoToBlender(geojsonPath, fitSquareProjection(), outputPath, {
    decimals: 3,
  });

  const obj = await readFile(outputPath, "utf8");
  const point = geoToBlenderPoint(-1, -1, fitSquareProjection(), {
    decimals: 3,
    toArray: true,
  });

  assertEquals(point, firstVertex(obj));
});

test("should place flat projection points on Blender's X/Y plane", () => {
  const point = geoToBlenderPoint(-1, -1, fitSquareProjection(), {
    decimals: 3,
  });

  assertEquals(point, { x: -5, y: -5, z: 0 });
});

test("should convert points with a pre-fitted flat projection", () => {
  const projection = fitSquareProjection();
  const point = geoToBlenderPoint(-1, -1, projection, {
    decimals: 3,
    toArray: true,
  });

  assertEquals(point, [-5, -5, 0]);
});

test("should place northern flat projection points above southern points", () => {
  const projection = fitSquareProjection();
  const south = geoToBlenderPoint(0, -1, projection);
  const north = geoToBlenderPoint(0, 1, projection);

  assert(north.y > south.y);
});

test("should place Canada points inside flat Blender boundary extents", async () => {
  await mkdir(outputDir, { recursive: true });
  const outputPath = `${outputDir}/canada-provinces-territories.obj`;

  const canadaGeoJson = parseGeoJson(await readFile(provincesPath, "utf8"));
  const projection = geoMercator().fitExtent(
    [
      [-5, -5],
      [5, 5],
    ],
    {
      type: "MultiLineString",
      coordinates: getLines(canadaGeoJson),
    },
  );
  await geoToBlender(provincesPath, projection, outputPath, {
    decimals: 3,
  });
  const obj = await readFile(outputPath, "utf8");
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

test("should place a point inside extents when fitting a conic conformal to rewound polygons", async () => {
  // Fitting geoConicConformal to the raw polygons collapses the projection to
  // a near-zero scale (see geoToBlender.test.ts). Rewinding the polygons first
  // gives a real extent, so the point and the borders share the same layout.
  await mkdir(outputDir, { recursive: true });
  const outputPath = `${outputDir}/canada-provinces-territories-rewound.obj`;
  const domain = rewind(parseGeoJson(await readFile(provincesPath, "utf8")));

  const projection = geoConicConformal()
    .rotate([100, -60])
    .fitExtent(
      [
        [-5, -5],
        [5, 5],
      ],
      geometryDomain(domain),
    );

  await geoToBlender(provincesPath, projection, outputPath, {
    decimals: 3,
  });
  const obj = await readFile(outputPath, "utf8");
  const bounds = vertexBounds(obj);
  const point = geoToBlenderPoint(-75.6972, 45.4215, projection, {
    decimals: 3,
  });

  // The fit is not collapsed: the borders span a real extent.
  assert(Math.max(bounds.maxX - bounds.minX, bounds.maxY - bounds.minY) > 5);
  assertEquals(point.z, 0);
  assert(point.x >= bounds.minX && point.x <= bounds.maxX);
  assert(point.y >= bounds.minY && point.y <= bounds.maxY);
});

test("should throw when a flat projection cannot project the coordinate", () => {
  const projection = geoAlbersUsa().fitExtent(
    [
      [-5, -5],
      [5, 5],
    ],
    {
      type: "MultiLineString",
      coordinates: getLines(square),
    },
  );

  expect(() => geoToBlenderPoint(-1, -1, projection)).toThrow(
    "could not project coordinate [-1, -1]",
  );
});

function geometryDomain(geojson: GeoJsonObject): GeoJsonGeometry {
  if (geojson.type === "FeatureCollection") {
    return {
      type: "GeometryCollection",
      geometries: geojson.features.flatMap(({ geometry }) => (geometry ? [geometry] : [])),
    };
  }
  if (geojson.type === "Feature") {
    return { type: "GeometryCollection", geometries: geojson.geometry ? [geojson.geometry] : [] };
  }
  return geojson;
}
