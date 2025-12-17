/**
 * @module
 *
 * This module provides a collection of functions to be used in web applications.
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
