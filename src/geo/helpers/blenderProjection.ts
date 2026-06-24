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

  if (geojson.type === "MultiLineString" || geojson.type === "Polygon") {
    return geojson.coordinates;
  }

  if (geojson.type === "MultiPolygon") {
    return geojson.coordinates.flat();
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
