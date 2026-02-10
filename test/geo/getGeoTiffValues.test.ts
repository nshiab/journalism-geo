import { assertEquals } from "jsr:@std/assert";
import getGeoTiffDetails from "../../src/geo/getGeoTiffDetails.ts";
import getGeoTiffValues from "../../src/geo/getGeoTiffValues.ts";

Deno.test("should return the detailed information from a geoTiff", {
  sanitizeResources: false,
}, async () => {
  const geoTiffDetails = await getGeoTiffDetails("test/data/MAT.tif");
  const values = await getGeoTiffValues(
    45.5,
    -73.57,
    geoTiffDetails,
  );

  assertEquals(values[0], 6.5);
});
