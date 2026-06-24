import geoTo3D from "./geoTo3D.ts";
import { projectFlatCoordinate } from "./helpers/blenderProjection.ts";

/** A pre-fitted flat projection that converts longitude/latitude coordinates to x/y coordinates. */
export type GeoToBlenderPointFlatProjection = (
  coordinates: [number, number],
) => [number, number] | null;

/** A projection function or `"orthographic"` for a 3D globe point. */
export type GeoToBlenderPointProjection =
  | "orthographic"
  | GeoToBlenderPointFlatProjection;

/** Options for converting one longitude/latitude coordinate into Blender coordinates. */
export type GeoToBlenderPointOptions = {
  /**
   * For `"orthographic"`, the radius of the sphere in Blender units.
   * @default 10
   */
  radius?: number;
  /**
   * The number of decimal places to round coordinates to.
   */
  decimals?: number;
  /**
   * If `true`, the function returns `[x, y, z]` instead of `{ x, y, z }`.
   * @default false
   */
  toArray?: boolean;
};

/**
 * Converts one longitude/latitude coordinate into Blender coordinates.
 *
 * Flat projection functions are placed on Blender's X/Y plane with Z up and north toward positive Y.
 * The `"orthographic"` projection exports the coordinate in 3D on a sphere using `geoTo3D`.
 *
 * When fitting a flat projection with `fitExtent`/`fitSize`, run the GeoJSON through {@link rewind} first. Many data sources wind their polygons the wrong way for `d3-geo`, which makes the fit collapse to a near-zero scale and places every point at nearly the same spot. Use the same fitted projection here as the one passed to `geoToBlender` so the point lines up with the borders.
 *
 * @param lon - The longitude of the geographical point, in degrees.
 * @param lat - The latitude of the geographical point, in degrees.
 * @param projection - A flat projection function or `"orthographic"` for a 3D globe point.
 * @param options - Optional settings for orthographic radius, coordinate rounding, and return shape.
 * @returns Blender coordinates.
 *
 * @example
 * ```ts
 * import { geoToBlenderPoint, rewind } from "@nshiab/journalism-geo";
 * import { geoConicConformal } from "d3-geo";
 * import { readFile } from "node:fs/promises";
 *
 * const geojson = JSON.parse(await readFile("./data/canada.geojson", "utf8"));
 * // Rewind so fitExtent measures the real extent instead of collapsing.
 * const domain = rewind(geojson);
 * const projection = geoConicConformal()
 *   .rotate([100, -60])
 *   .fitExtent([[-5, -5], [5, 5]], domain);
 * const point = geoToBlenderPoint(-73.5674, 45.5019, projection, {
 *   decimals: 3,
 * });
 * ```
 * @category Geo
 */
export default function geoToBlenderPoint(
  lon: number,
  lat: number,
  projection:
    | "orthographic"
    | ((coordinates: [number, number]) => [number, number] | null),
  options?: {
    /**
     * For `"orthographic"`, the radius of the sphere in Blender units.
     * @default 10
     */
    radius?: number;
    /**
     * The number of decimal places to round coordinates to.
     */
    decimals?: number;
    /**
     * If `true`, the function returns `[x, y, z]` instead of `{ x, y, z }`.
     * @default false
     */
    toArray?: false;
  },
): { x: number; y: number; z: number };

/**
 * Converts one longitude/latitude coordinate into Blender coordinates.
 *
 * Flat projection functions are placed on Blender's X/Y plane with Z up and north toward positive Y.
 * The `"orthographic"` projection exports the coordinate in 3D on a sphere using `geoTo3D`.
 *
 * @param lon - The longitude of the geographical point, in degrees.
 * @param lat - The latitude of the geographical point, in degrees.
 * @param projection - A flat projection function or `"orthographic"` for a 3D globe point.
 * @param options - Optional settings for orthographic radius, coordinate rounding, and return shape.
 * @returns Blender coordinates.
 *
 * @example
 * ```ts
 * import { geoToBlenderPoint } from "@nshiab/journalism-geo";
 *
 * const point = geoToBlenderPoint(-73.5674, 45.5019, "orthographic", {
 *   radius: 10,
 *   decimals: 3,
 *   toArray: true,
 * });
 * ```
 * @category Geo
 */
export default function geoToBlenderPoint(
  lon: number,
  lat: number,
  projection:
    | "orthographic"
    | ((coordinates: [number, number]) => [number, number] | null),
  options: {
    /**
     * For `"orthographic"`, the radius of the sphere in Blender units.
     * @default 10
     */
    radius?: number;
    /**
     * The number of decimal places to round coordinates to.
     */
    decimals?: number;
    /**
     * If `true`, the function returns `[x, y, z]` instead of `{ x, y, z }`.
     * @default false
     */
    toArray: true;
  },
): [number, number, number];

/**
 * Implementation signature for geoToBlenderPoint function.
 * @ignore
 */
export default function geoToBlenderPoint(
  lon: number,
  lat: number,
  projection:
    | "orthographic"
    | ((coordinates: [number, number]) => [number, number] | null),
  options: {
    radius?: number;
    decimals?: number;
    toArray?: boolean;
  } = {},
): { x: number; y: number; z: number } | [number, number, number] {
  const radius = options.radius ?? 10;

  if (projection === "orthographic") {
    const point = geoTo3D(lon, lat, radius, {
      decimals: options.decimals,
      toArray: true,
    });

    if (options.toArray) {
      return point;
    }

    const [x, y, z] = point;
    return { x, y, z };
  }

  const point = projectFlatCoordinate(projection, lon, lat, options.decimals);

  if (point === null) {
    throw new Error(
      `Projection could not project coordinate [${lon}, ${lat}].`,
    );
  }

  if (options.toArray) {
    return point;
  }

  const [x, y, z] = point;
  return { x, y, z };
}
