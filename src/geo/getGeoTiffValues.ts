function hasReadRasters(value: unknown): value is {
  readRasters(options: { window: number[] }): unknown;
} {
  return (
    typeof value === "object" &&
    value !== null &&
    "readRasters" in value &&
    typeof value.readRasters === "function"
  );
}

/**
 * Extracts values at specific latitude and longitude coordinates from a GeoTIFF image. This function works in conjunction with the `getGeoTiffDetails` function, using the details returned by it.
 *
 * @example
 * ```ts
 * // Basic usage
 *
 * const geoTiffDetails = await getGeoTiffDetails("./some-file.tif")
 * const value = await getGeoTiffValues(45.50, -73.57, geoTiffDetails)
 * console.log(value) // 255
 * ```
 * @param lat - The latitude coordinate for which to extract the value.
 * @param lon - The longitude coordinate for which to extract the value.
 * @param geoTiffDetails - An object containing the GeoTIFF image details, typically obtained from `getGeoTiffDetails`.
 * @returns A Promise that resolves to the pixel value at the specified coordinates, or a `TypedArray` if multiple bands are present.
 * @throws {Error} If the coordinates are outside the GeoTIFF's bounding box or if there's an issue reading the raster data.
 *
 * @category Geo
 */
export default async function getGeoTiffValues(
  lat: number,
  lon: number,
  geoTiffDetails: {
    image: unknown;
    bbox: number[];
    pixelWidth: number;
    pixelHeight: number;
    bboxWidth: number;
    bboxHeight: number;
  },
): Promise<
  | Uint8Array
  | Int8Array
  | Uint16Array
  | Int16Array
  | Uint32Array
  | Int32Array
  | Float32Array
  | Float64Array
> {
  const { image, bbox, pixelWidth, pixelHeight, bboxWidth, bboxHeight } = geoTiffDetails;

  const widthPct = (lon - bbox[0]) / bboxWidth;
  const heightPct = (lat - bbox[1]) / bboxHeight;
  const xPx = Math.floor(pixelWidth * widthPct);
  const yPx = Math.floor(pixelHeight * (1 - heightPct));
  const window = [xPx, yPx, xPx + 1, yPx + 1];
  if (!hasReadRasters(image)) {
    throw new TypeError("Expected an image with a readRasters method.");
  }
  const data = await image.readRasters({ window });

  if (!Array.isArray(data)) throw new TypeError("Expected an array of raster bands.");
  const band: unknown = data[0];
  if (
    band instanceof Uint8Array ||
    band instanceof Int8Array ||
    band instanceof Uint16Array ||
    band instanceof Int16Array ||
    band instanceof Uint32Array ||
    band instanceof Int32Array ||
    band instanceof Float32Array ||
    band instanceof Float64Array
  )
    return band;
  throw new TypeError("Expected a numeric raster band.");
}
