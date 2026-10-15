import { test, expect } from "vite-plus/test";
import { deepStrictEqual as assertEquals } from "node:assert/strict";
import getGeoTiffDetails from "../../src/geo/getGeoTiffDetails.ts";
import getGeoTiffValues from "../../src/geo/getGeoTiffValues.ts";

test("should return the detailed information from a geoTiff", async () => {
  const geoTiffDetails = await getGeoTiffDetails("test/data/MAT.tif");
  const values = await getGeoTiffValues(45.5, -73.57, geoTiffDetails);

  assertEquals(values[0], 6.5);
});

test("should accept a compatible image and request the expected raster window", async () => {
  const band = new Float32Array([6.5]);
  const values = await getGeoTiffValues(5, 5, {
    image: {
      readRasters({ window }: { window: number[] }) {
        assertEquals(window, [5, 5, 6, 6]);
        return Promise.resolve([band]);
      },
    },
    bbox: [0, 0, 10, 10],
    pixelWidth: 10,
    pixelHeight: 10,
    bboxWidth: 10,
    bboxHeight: 10,
  });
  expect(values).toBe(band);
});

test("should reject malformed raster output", async () => {
  for (const output of [null, ["not a raster band"]]) {
    await expect(
      getGeoTiffValues(5, 5, {
        image: {
          readRasters() {
            return Promise.resolve(output);
          },
        },
        bbox: [0, 0, 10, 10],
        pixelWidth: 10,
        pixelHeight: 10,
        bboxWidth: 10,
        bboxHeight: 10,
      }),
    ).rejects.toBeInstanceOf(TypeError);
  }
});
