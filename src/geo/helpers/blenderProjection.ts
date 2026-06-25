export type Position = [number, number] | [number, number, number];

export type GeoJsonGeometry =
  | { type: "Point"; coordinates: Position }
  | { type: "MultiPoint"; coordinates: Position[] }
  | { type: "LineString"; coordinates: Position[] }
  | { type: "MultiLineString"; coordinates: Position[][] }
  | { type: "Polygon"; coordinates: Position[][] }
  | { type: "MultiPolygon"; coordinates: Position[][][] }
  | { type: "GeometryCollection"; geometries: GeoJsonGeometry[] };

export type GeoJsonObject =
  | GeoJsonGeometry
  | { type: "Feature"; geometry: GeoJsonGeometry | null }
  | {
    type: "FeatureCollection";
    features: { geometry: GeoJsonGeometry | null }[];
  };

/**
 * Closes a polygon ring by repeating its first coordinate at the end when it is
 * not already there. Rings that are already closed (or too short to close) are
 * returned unchanged.
 */
function closeRing(ring: Position[]): Position[] {
  if (ring.length < 2) {
    return ring;
  }

  const first = ring[0];
  const last = ring[ring.length - 1];

  if (first[0] === last[0] && first[1] === last[1]) {
    return ring;
  }

  return [...ring, first];
}

export function getLines(geojson: GeoJsonObject): Position[][] {
  if (geojson.type === "FeatureCollection") {
    return geojson.features.flatMap((feature) =>
      feature.geometry ? getLines(feature.geometry) : []
    );
  }

  if (geojson.type === "Feature") {
    return geojson.geometry ? getLines(geojson.geometry) : [];
  }

  if (geojson.type === "LineString") {
    return [geojson.coordinates];
  }

  if (geojson.type === "MultiLineString") {
    return geojson.coordinates;
  }

  // Polygon and MultiPolygon rings are closed so borders always form loops,
  // even when the source data omits the repeated closing coordinate.
  if (geojson.type === "Polygon") {
    return geojson.coordinates.map(closeRing);
  }

  if (geojson.type === "MultiPolygon") {
    return geojson.coordinates.flat().map(closeRing);
  }

  if (geojson.type === "GeometryCollection") {
    return geojson.geometries.flatMap((geometry) => getLines(geometry));
  }

  return [];
}

export function roundValue(value: number, decimals?: number): number {
  if (typeof decimals === "number") {
    return parseFloat(value.toFixed(decimals));
  }

  return value;
}

export function projectFlatCoordinate(
  d3Projection: (coordinates: [number, number]) => [number, number] | null,
  lon: number,
  lat: number,
  decimals?: number,
): [number, number, number] | null {
  const projected = d3Projection([lon, lat]);

  if (projected === null) {
    return null;
  }

  const [x, y] = projected;
  return [roundValue(x, decimals), roundValue(-y, decimals), 0];
}
