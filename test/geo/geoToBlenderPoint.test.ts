import { assertEquals, assertThrows } from "jsr:@std/assert";
import geoToBlender from "../../src/geo/geoToBlender.ts";
import geoToBlenderPoint from "../../src/geo/geoToBlenderPoint.ts";

const outputDir = "test/output/geoToBlenderPoint";

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
