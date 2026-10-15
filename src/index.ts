/**
 * @module
 *
 * The Journalism library (geospatial functions)
 *
 * To install the library with Node.js, use:
 * ```bash
 * npm i @nshiab/journalism-geo
 * ```
 *
 * To import a function, use:
 * ```ts
 * import { functionName } from "@nshiab/journalism-geo";
 * ```
 *
 * To import a function from the web entry point, use:
 * ```ts
 * import { functionName } from "@nshiab/journalism-geo/web";
 * ```
 */

import geoTo3D from "./geo/geoTo3D.ts";
import geoToBlender from "./geo/geoToBlender.ts";
import geoToBlenderPoint from "./geo/geoToBlenderPoint.ts";
import distance from "./geo/distance.ts";
import styledLayerDescriptor from "./geo/styledLayerDescriptor.ts";
import getClosest from "./geo/getClosest.ts";
import getGeoTiffDetails from "./geo/getGeoTiffDetails.ts";
import getGeoTiffValues from "./geo/getGeoTiffValues.ts";
// Exported from journalism-dataviz
// import rewind from "./geo/rewind.ts";

export {
  distance,
  geoTo3D,
  geoToBlender,
  geoToBlenderPoint,
  getClosest,
  getGeoTiffDetails,
  getGeoTiffValues,
  // rewind,
  styledLayerDescriptor,
};
