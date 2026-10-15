import { test } from "vite-plus/test";
import { deepStrictEqual as assertEquals } from "node:assert/strict";
import getGeoTiffDetails from "../../src/geo/getGeoTiffDetails.ts";

test("should return the detailed information from a geoTiff", async () => {
  const geoTiffDetails = await getGeoTiffDetails("test/data/MAT.tif");
  const { image, ...details } = geoTiffDetails;
  assertEquals(image.getWidth(), geoTiffDetails.pixelWidth);
  assertEquals(details, {
    bbox: [-179.187500033, 14.431998000000007, -52.604166666, 83.223664685],
    pixelWidth: 3038,
    pixelHeight: 1651,
    bboxWidth: 126.583333367,
    bboxHeight: 68.791666685,
  });
});
