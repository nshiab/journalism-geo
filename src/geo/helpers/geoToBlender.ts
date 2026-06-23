import {
  geoAlbers,
  geoAlbersUsa,
  geoConicConformal,
  geoConicEqualArea,
  geoConicEquidistant,
  geoEqualEarth,
  geoEquirectangular,
  geoMercator,
  geoNaturalEarth1,
  geoTransverseMercator,
} from "d3-geo";

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

export type FlatProjection = {
  fitExtent: (
    extent: [[number, number], [number, number]],
    object: GeoJsonObject,
  ) => FlatProjection;
  rotate: (angles: GeoToBlenderRotate) => FlatProjection;
  (coordinates: [number, number]): [number, number] | null;
};

/** Rotation angles for flat d3-geo projections, in degrees. */
export type GeoToBlenderRotate =
  | [number, number]
  | [number, number, number];

/** The supported projection names for Blender coordinate conversion. */
export type GeoToBlenderProjection =
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
  | "transverseMercator";

export function getProjection(
  projection: Exclude<GeoToBlenderProjection, "orthographic">,
): FlatProjection {
  if (projection === "albers") {
    return geoAlbers() as FlatProjection;
  }

  if (projection === "albersUsa") {
    return geoAlbersUsa() as FlatProjection;
  }

  if (projection === "conicConformal") {
    return geoConicConformal() as FlatProjection;
  }

  if (projection === "conicEqualArea") {
    return geoConicEqualArea() as FlatProjection;
  }

  if (projection === "conicEquidistant") {
    return geoConicEquidistant() as FlatProjection;
  }

  if (projection === "mercator") {
    return geoMercator() as FlatProjection;
  }

  if (projection === "equalEarth") {
    return geoEqualEarth() as FlatProjection;
  }

  if (projection === "equirectangular") {
    return geoEquirectangular() as FlatProjection;
  }

  if (projection === "transverseMercator") {
    return geoTransverseMercator() as FlatProjection;
  }

  return geoNaturalEarth1() as FlatProjection;
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

export function linesToGeoJson(lines: Position[][]): GeoJsonGeometry {
  return {
    type: "MultiLineString",
    coordinates: lines,
  };
}

export function roundValue(value: number, decimals?: number): number {
  if (typeof decimals === "number") {
    return parseFloat(value.toFixed(decimals));
  }

  return value;
}

export function fitProjection(
  projection: Exclude<GeoToBlenderProjection, "orthographic">,
  geojson: GeoJsonObject,
  scale: number,
  rotate?: GeoToBlenderRotate,
): FlatProjection {
  const d3Projection = getProjection(projection);

  if (rotate) {
    d3Projection.rotate(rotate);
  }

  d3Projection.fitExtent(
    [[-scale / 2, -scale / 2], [scale / 2, scale / 2]],
    geojson,
  );

  return d3Projection;
}

export function projectFlatCoordinate(
  d3Projection: FlatProjection,
  lon: number,
  lat: number,
  decimals?: number,
): [number, number, number] | null {
  const projected = d3Projection([lon, lat]);

  if (projected === null) {
    return null;
  }

  const [x, y] = projected;
  return [roundValue(x, decimals), roundValue(y, decimals), 0];
}
