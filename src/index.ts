/**
 * @module
 *
 * The Journalism library (geospatial functions)
 *
 * To install the library with Deno, use:
 * ```bash
 * deno add jsr:@nshiab/journalism-geo
 * ```
 *
 * To install the library with Node.js, use:
 * ```bash
 * npx jsr add @nshiab/journalism-geo
 * ```
 *
 * To import a function, use:
 * ```ts
 * import { functionName } from "@nshiab/journalism-geo";
 * ```
 */

import geoTo3D from "./geo/geoTo3D.ts";
import distance from "./geo/distance.ts";
import styledLayerDescriptor from "./geo/styledLayerDescriptor.ts";
import getClosest from "./geo/getClosest.ts";
import getGeoTiffDetails from "./geo/getGeoTiffDetails.ts";
import getGeoTiffValues from "./geo/getGeoTiffValues.ts";

export {
  distance,
  geoTo3D,
  getClosest,
  getGeoTiffDetails,
  getGeoTiffValues,
  styledLayerDescriptor,
};
