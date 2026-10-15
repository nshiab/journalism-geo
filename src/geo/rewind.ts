import { geoArea, geoContains } from "d3-geo";
import type { GeoJsonGeometry, GeoJsonObject, Position } from "./helpers/blenderProjection.ts";

// Equivalent to the original d3 stream transform, retaining its spherical
// winding rules and its two-dimensional, closed polygon output.
function rewindPolygon(coordinates: Position[][]): Position[][] {
  const polygon = coordinates.map((ring) =>
    ring.slice(0, -1).map(([x, y]): [number, number] => [x, y]),
  );
  for (const [index, ring] of polygon.entries()) {
    ring.push([...ring[0]]);
    const shape = { type: "Polygon", coordinates: [ring] } satisfies GeoJsonGeometry;
    const reverse = index
      ? !geoContains(shape, polygon[0][0])
      : polygon[1]
        ? !geoContains(shape, polygon[1][0])
        : geoArea(shape) > 2 * Math.PI;
    if (reverse) ring.reverse();
    ring.pop();
  }
  return polygon.map((ring) => [...ring, [...ring[0]]]);
}

function rewindGeometry(geometry: GeoJsonGeometry): GeoJsonGeometry {
  switch (geometry.type) {
    case "GeometryCollection":
      return { ...geometry, geometries: geometry.geometries.map(rewindGeometry) };
    case "Polygon":
      return { ...geometry, coordinates: rewindPolygon(geometry.coordinates) };
    case "MultiPolygon":
      return { ...geometry, coordinates: geometry.coordinates.map(rewindPolygon) };
    default:
      return geometry;
  }
}

export default function rewind<T extends GeoJsonObject>(geojson: T): T;
export default function rewind(geojson: GeoJsonObject): GeoJsonObject {
  if (geojson.type === "FeatureCollection") {
    return {
      ...geojson,
      features: geojson.features.map((feature) => ({
        ...feature,
        geometry: feature.geometry ? rewindGeometry(feature.geometry) : null,
      })),
    };
  }
  if (geojson.type === "Feature") {
    return { ...geojson, geometry: geojson.geometry ? rewindGeometry(geojson.geometry) : null };
  }
  return rewindGeometry(geojson);
}
