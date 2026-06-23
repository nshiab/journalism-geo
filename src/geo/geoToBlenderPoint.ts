import geoTo3D from "./geoTo3D.ts";
import {
  fitProjection,
  type GeoJsonObject,
  getLines,
  linesToGeoJson,
  projectFlatCoordinate,
} from "./helpers/geoToBlender.ts";

/** Options for converting one longitude/latitude coordinate into Blender coordinates. */
export type GeoToBlenderPointOptions = {
  /**
   * For flat projections, the width and height of the fitted projection extent in Blender units.
   * For `"orthographic"`, the radius of the sphere in Blender units.
   * @default 10
   */
  scale?: number;
  /**
   * The number of decimal places to round coordinates to.
   */
  decimals?: number;
  /**
   * Rotation angles for flat d3-geo projections, in degrees.
   * These values are passed to the projection's `rotate` method before fitting.
   */
  rotate?: [number, number] | [number, number, number];
  /**
   * GeoJSON used to fit flat projections before projecting the coordinate.
   * Required for every projection except `"orthographic"`.
   */
  fitTo?: object;
  /**
   * If `true`, the function returns `[x, y, z]` instead of `{ x, y, z }`.
   * @default false
   */
  toArray?: boolean;
};

function getFitToGeoJson(fitTo: object | undefined): GeoJsonObject {
  if (fitTo) {
    return fitTo as GeoJsonObject;
  }

  throw new Error(
    "geoToBlenderPoint requires options.fitTo for flat projections.",
  );
}

/**
 * Converts one longitude/latitude coordinate into Blender coordinates.
 *
 * Flat projections are fitted to `options.fitTo` and placed on Blender's X/Y plane with Z up.
 * The `"orthographic"` projection exports the coordinate in 3D on a sphere using `geoTo3D`.
 *
 * @param lon - The longitude of the geographical point, in degrees.
 * @param lat - The latitude of the geographical point, in degrees.
 * @param projection - The projection to use. Supports d3-geo conic and cylindrical projection names, plus `"orthographic"` for a 3D globe point.
 * @param options - Optional settings for scale, coordinate rounding, projection fitting, and return shape.
 * @returns Blender coordinates.
 *
 * @example
 * ```ts
 * const point = geoToBlenderPoint(-73.5674, 45.5019, "mercator", {
 *   fitTo: canadaGeoJson,
 *   scale: 10,
 *   decimals: 3,
 * });
 * ```
 * @category Geo
 */
export default function geoToBlenderPoint(
  lon: number,
  lat: number,
  projection:
    | "albers"
    | "albersUsa"
    | "conicConformal"
    | "conicEqualArea"
    | "conicEquidistant"
    | "equirectangular"
    | "equalEarth"
    | "mercator"
    | "naturalEarth1"
    | "orthographic"
    | "transverseMercator",
  options: {
    /**
     * For flat projections, the width and height of the fitted projection extent in Blender units.
     * For `"orthographic"`, the radius of the sphere in Blender units.
     * @default 10
     */
    scale?: number;
    /**
     * The number of decimal places to round coordinates to.
     */
    decimals?: number;
    /**
     * Rotation angles for flat d3-geo projections, in degrees.
     * These values are passed to the projection's `rotate` method before fitting.
     */
    rotate?: [number, number] | [number, number, number];
    /**
     * GeoJSON used to fit flat projections before projecting the coordinate.
     * Required for every projection except `"orthographic"`.
     */
    fitTo?: object;
    /**
     * If `true`, the function returns `[x, y, z]` instead of `{ x, y, z }`.
     * @default false
     */
    toArray: true;
  },
): [number, number, number];

/**
 * Converts one longitude/latitude coordinate into Blender coordinates.
 *
 * Flat projections are fitted to `options.fitTo` and placed on Blender's X/Y plane with Z up.
 * The `"orthographic"` projection exports the coordinate in 3D on a sphere using `geoTo3D`.
 *
 * @param lon - The longitude of the geographical point, in degrees.
 * @param lat - The latitude of the geographical point, in degrees.
 * @param projection - The projection to use. Supports d3-geo conic and cylindrical projection names, plus `"orthographic"` for a 3D globe point.
 * @param options - Optional settings for scale, coordinate rounding, projection fitting, and return shape.
 * @returns Blender coordinates.
 *
 * @example
 * ```ts
 * const point = geoToBlenderPoint(-73.5674, 45.5019, "orthographic", {
 *   scale: 10,
 *   decimals: 3,
 * });
 * ```
 * @category Geo
 */
export default function geoToBlenderPoint(
  lon: number,
  lat: number,
  projection:
    | "albers"
    | "albersUsa"
    | "conicConformal"
    | "conicEqualArea"
    | "conicEquidistant"
    | "equirectangular"
    | "equalEarth"
    | "mercator"
    | "naturalEarth1"
    | "orthographic"
    | "transverseMercator",
  options?: {
    /**
     * For flat projections, the width and height of the fitted projection extent in Blender units.
     * For `"orthographic"`, the radius of the sphere in Blender units.
     * @default 10
     */
    scale?: number;
    /**
     * The number of decimal places to round coordinates to.
     */
    decimals?: number;
    /**
     * Rotation angles for flat d3-geo projections, in degrees.
     * These values are passed to the projection's `rotate` method before fitting.
     */
    rotate?: [number, number] | [number, number, number];
    /**
     * GeoJSON used to fit flat projections before projecting the coordinate.
     * Required for every projection except `"orthographic"`.
     */
    fitTo?: object;
    /**
     * If `true`, the function returns `[x, y, z]` instead of `{ x, y, z }`.
     * @default false
     */
    toArray?: false;
  },
): { x: number; y: number; z: number };

/**
 * Implementation signature for geoToBlenderPoint function.
 * @ignore
 */
export default function geoToBlenderPoint(
  lon: number,
  lat: number,
  projection:
    | "albers"
    | "albersUsa"
    | "conicConformal"
    | "conicEqualArea"
    | "conicEquidistant"
    | "equirectangular"
    | "equalEarth"
    | "mercator"
    | "naturalEarth1"
    | "orthographic"
    | "transverseMercator",
  options: GeoToBlenderPointOptions = {},
): { x: number; y: number; z: number } | [number, number, number] {
  const scale = options.scale ?? 10;

  if (projection === "orthographic") {
    const point = geoTo3D(lon, lat, scale, {
      decimals: options.decimals,
      toArray: true,
    });

    if (options.toArray) {
      return point;
    }

    const [x, y, z] = point;
    return { x, y, z };
  }

  const fitToGeoJson = getFitToGeoJson(options.fitTo);
  const d3Projection = fitProjection(
    projection,
    linesToGeoJson(getLines(fitToGeoJson)),
    scale,
    options.rotate,
  );
  const point = projectFlatCoordinate(d3Projection, lon, lat, options.decimals);

  if (point === null) {
    throw new Error(
      `Projection ${projection} could not project coordinate [${lon}, ${lat}].`,
    );
  }

  if (options.toArray) {
    return point;
  }

  const [x, y, z] = point;
  return { x, y, z };
}
