/**
 * @module
 *
 * The Journalism library (geospatial functions) - Web entry point
 *
 * To install the library with Deno, use:
 * ```bash
 * deno add jsr:@nshiab/journalism-geo
 * ```
 *
 * To install the library with Node.js, use:
 * ```bash
 * npm i @nshiab/journalism-geo
 * ```
 *
 * To import a function, use:
 * ```ts
 * import { functionName } from "@nshiab/journalism-geo/web";
 * ```
 */

import geoTo3D from "./geo/geoTo3D.ts";
import distance from "./geo/distance.ts";
import styledLayerDescriptor from "./geo/styledLayerDescriptor.ts";
import getClosest from "./geo/getClosest.ts";

export { distance, geoTo3D, getClosest, styledLayerDescriptor };
