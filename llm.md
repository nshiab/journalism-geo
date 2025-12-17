# The Journalism library (geospatial functions)

To install the library with Deno, use:

```bash
deno add jsr:@nshiab/journalism-geo
```

To install the library with Node.js, use:

```bash
npx jsr add @nshiab/journalism-geo
```

To import a function, use:

```ts
import { functionName } from "@nshiab/journalism-geo";
```

## distance

Calculates the Haversine distance between two geographical points (longitude and
latitude) in kilometers. The Haversine formula is used to determine the
great-circle distance between two points on a sphere given their longitudes and
latitudes.

This function is useful for geospatial applications where accurate distance
measurements over the Earth's surface are required,.

### Signature

```typescript
function distance(
  lon1: number,
  lat1: number,
  lon2: number,
  lat2: number,
  options?: { decimals?: number },
): number;
```

### Parameters

- **`lon1`**: The longitude of the first point.
- **`lat1`**: The latitude of the first point.
- **`lon2`**: The longitude of the second point.
- **`lat2`**: The latitude of the second point.
- **`options`**: Optional settings for the distance calculation.
- **`options.decimals`**: The number of decimal places to round the result to.
  If not specified, the result will not be rounded.

### Returns

The distance between the two points in kilometers.

### Examples

```ts
// Basic usage: Calculate the distance between two cities.
// Montreal (-73.5673, 45.5017) and Toronto (-79.3832, 43.6532)
const dist = distance(-73.5673, 45.5017, -79.3832, 43.6532);
console.log(dist); // Approximately 504.5 km
```

```ts
// Rounding the result to a whole number.
const roundedDist = distance(-73.5673, 45.5017, -79.3832, 43.6532, {
  decimals: 0,
});
console.log(roundedDist); // 505 km
```

## geoTo3D

Converts geographical coordinates (longitude and latitude) into 3D Cartesian (x,
y, z) coordinates based on a specified radius.

The conversion assumes a spherical Earth model. The `radius` parameter
determines the size of the sphere on which the points are projected.

### Signature

```typescript
function geoTo3D(
  lon: number,
  lat: number,
  radius: number,
  options: { decimals?: number; toArray: true },
): [number, number, number];
```

### Parameters

- **`lon`**: The longitude of the geographical point, in degrees.
- **`lat`**: The latitude of the geographical point, in degrees.
- **`radius`**: The radius of the sphere on which to project the coordinates.
- **`options`**: Optional settings for the conversion.
- **`options.decimals`**: The number of decimal places to round the x, y, and z
  coordinates to. If not specified, no rounding is applied.
- **`options.toArray`**: If `true`, the function will return the coordinates as
  an array `[x, y, z]` instead of an object `{ x, y, z }`. Defaults to `false`.

### Returns

An object `{ x, y, z }` or an array `[x, y, z]` representing the 3D Cartesian
coordinates.

### Examples

```ts
// Basic usage: Convert geographical coordinates to 3D object coordinates.
// Longitude: -73.5674 (Montreal), Latitude: 45.5019 (Montreal), Radius: 1
const coordsObject = geoTo3D(-73.5674, 45.5019, 1, { decimals: 2 });
console.log(coordsObject); // Expected output: { x: -0.67, y: 0.71, z: 0.2 }
```

```ts
// Convert geographical coordinates to 3D array coordinates.
const coordsArray = geoTo3D(-73.5674, 45.5019, 1, {
  decimals: 2,
  toArray: true,
});
console.log(coordsArray); // Expected output: [-0.67, 0.71, 0.2]
```

```ts
// Using a larger radius for visualization purposes.
const earthCoords = geoTo3D(0, 0, 6371, { decimals: 0 }); // Earth's approximate radius in km
console.log(earthCoords); // Expected output: { x: 0, y: 6371, z: 0 } (for 0,0 lat/lon)
```

## geoTo3D

Converts geographical coordinates (longitude and latitude) into 3D Cartesian (x,
y, z) coordinates based on a specified radius.

The conversion assumes a spherical Earth model. The `radius` parameter
determines the size of the sphere on which the points are projected.

### Signature

```typescript
function geoTo3D(
  lon: number,
  lat: number,
  radius: number,
  options?: { decimals?: number; toArray?: false },
): { x: number; y: number; z: number };
```

### Parameters

- **`lon`**: The longitude of the geographical point, in degrees.
- **`lat`**: The latitude of the geographical point, in degrees.
- **`radius`**: The radius of the sphere on which to project the coordinates.
- **`options`**: Optional settings for the conversion.
- **`options.decimals`**: The number of decimal places to round the x, y, and z
  coordinates to. If not specified, no rounding is applied.
- **`options.toArray`**: If `true`, the function will return the coordinates as
  an array `[x, y, z]` instead of an object `{ x, y, z }`. Defaults to `false`.

### Returns

An object `{ x, y, z }` or an array `[x, y, z]` representing the 3D Cartesian
coordinates.

### Examples

```ts
// Basic usage: Convert geographical coordinates to 3D object coordinates.
// Longitude: -73.5674 (Montreal), Latitude: 45.5019 (Montreal), Radius: 1
const coordsObject = geoTo3D(-73.5674, 45.5019, 1, { decimals: 2 });
console.log(coordsObject); // Expected output: { x: -0.67, y: 0.71, z: 0.2 }
```

```ts
// Convert geographical coordinates to 3D array coordinates.
const coordsArray = geoTo3D(-73.5674, 45.5019, 1, {
  decimals: 2,
  toArray: true,
});
console.log(coordsArray); // Expected output: [-0.67, 0.71, 0.2]
```

```ts
// Using a larger radius for visualization purposes.
const earthCoords = geoTo3D(0, 0, 6371, { decimals: 0 }); // Earth's approximate radius in km
console.log(earthCoords); // Expected output: { x: 0, y: 6371, z: 0 } (for 0,0 lat/lon)
```

## getClosest

Finds the geographical item closest to a given reference point (longitude and
latitude) from a list of geographical items.

The function calculates the distance between the reference point and each item
in the `geoItems` array using the Haversine formula (via the `distance`
function). It then returns the item with the minimum distance.

Optionally, you can choose to add the calculated distance as a new property to
the returned closest item. If the `geoItems` have a `properties` key (common in
GeoJSON-like structures), the distance will be added there; otherwise, it will
be added directly to the item object.

### Signature

```typescript
function getClosest<T>(
  lon: number,
  lat: number,
  geoItems: T[],
  getItemLon: (item: T) => number,
  getItemLat: (item: T) => number,
  options?: { addDistance?: false; decimals?: number },
): T;
```

### Parameters

- **`lon`**: The longitude of the reference point.
- **`lat`**: The latitude of the reference point.
- **`geoItems`**: An array of geographical items to search through. Each item
  should contain properties that can be accessed by `getItemLon` and
  `getItemLat` to retrieve its longitude and latitude.
- **`getItemLon`**: A function that takes an item from `geoItems` and returns
  its longitude.
- **`getItemLat`**: A function that takes an item from `geoItems` and returns
  its latitude.
- **`options`**: Optional settings for the search.
- **`options.addDistance`**: If `true`, the calculated distance to the closest
  item will be added as a property (`distance`) to the returned object. Defaults
  to `false`.
- **`options.decimals`**: The number of decimal places to round the calculated
  distance to, if `addDistance` is `true`.

### Returns

The geographical item from `geoItems` that is closest to the reference point. If
`addDistance` is `true`, the returned object will also include the `distance`
property.

### Examples

```ts
// Basic usage: Find the closest city to Ottawa.
const cities = [
  { name: "Montreal", lon: -73.5673, lat: 45.5017 },
  { name: "Toronto", lon: -79.3832, lat: 43.6532 },
  { name: "Vancouver", lon: -123.1207, lat: 49.2827 },
];
const ottawa = { lon: -75.6972, lat: 45.4215 };

const closestCity = getClosest(
  ottawa.lon,
  ottawa.lat,
  cities,
  (d) => d.lon,
  (d) => d.lat,
  { addDistance: true, decimals: 2 },
);

console.log(closestCity);
// Expected output: { name: "Montreal", lon: -73.5673, lat: 45.5017, distance: 160.69 }
```

```ts
// Finding the closest point in a GeoJSON FeatureCollection.
const featureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Park A" },
      geometry: { type: "Point", coordinates: [-74.0, 40.7] },
    },
    {
      type: "Feature",
      properties: { name: "Park B" },
      geometry: { type: "Point", coordinates: [-73.9, 40.8] },
    },
  ],
};
const userLocation = { lon: -73.95, lat: 40.75 };

const closestPark = getClosest(
  userLocation.lon,
  userLocation.lat,
  featureCollection.features,
  (f) => f.geometry.coordinates[0],
  (f) => f.geometry.coordinates[1],
  { addDistance: true },
);

console.log(closestPark);
// Expected output: { type: "Feature", properties: { name: "Park B", distance: ... }, geometry: { ... } }
```

## getClosest

Finds the geographical item closest to a given reference point and adds distance
to the properties object.

### Signature

```typescript
function getClosest<T extends { properties: unknown }>(
  lon: number,
  lat: number,
  geoItems: T[],
  getItemLon: (item: T) => number,
  getItemLat: (item: T) => number,
  options: { addDistance: true; decimals?: number },
): T & { properties: T["properties"] & { distance: number } };
```

### Parameters

- **`lon`**: - The longitude of the reference point.
- **`lat`**: - The latitude of the reference point.
- **`geoItems`**: - An array of geographical items with properties objects.
- **`getItemLon`**: - A function that returns longitude from an item.
- **`getItemLat`**: - A function that returns latitude from an item.
- **`options`**: - Settings with addDistance: true for items with properties.

### Returns

The closest item with distance added to its properties object.

## getClosest

Finds the geographical item closest to a given reference point and adds distance
directly to the item.

### Signature

```typescript
function getClosest<T>(
  lon: number,
  lat: number,
  geoItems: T[],
  getItemLon: (item: T) => number,
  getItemLat: (item: T) => number,
  options: { addDistance: true; decimals?: number },
): T & { distance: number };
```

### Parameters

- **`lon`**: - The longitude of the reference point.
- **`lat`**: - The latitude of the reference point.
- **`geoItems`**: - An array of geographical items without properties objects.
- **`getItemLon`**: - A function that returns longitude from an item.
- **`getItemLat`**: - A function that returns latitude from an item.
- **`options`**: - Settings with addDistance: true for items without properties.

### Returns

The closest item with distance added directly to the item.

## getGeoTiffDetails

Extracts detailed information from a GeoTIFF file, which can then be used with
the `getGeoTiffValues` function.

### Signature

```typescript
async function getGeoTiffDetails(
  path: string,
): Promise<
  {
    image: GeoTIFFImage;
    bbox: number[];
    pixelWidth: number;
    pixelHeight: number;
    bboxWidth: number;
    bboxHeight: number;
  }
>;
```

### Parameters

- **`path`**: - The absolute path to the GeoTIFF file.

### Returns

A Promise that resolves to an object containing the GeoTIFF image, bounding box,
pixel dimensions, and bounding box dimensions.

### Examples

```ts
// Basic usage
const geoTiffDetails = await getGeoTiffDetails("./some-file.tif");
console.log(geoTiffDetails.bbox); // [ -73.8, 45.4, -73.5, 45.6 ]
```

```ts
// Using the output with `getGeoTiffValues`

const geoTiffDetails = await getGeoTiffDetails("./some-file.tif");
const value = await getGeoTiffValues(45.50, -73.57, geoTiffDetails);
console.log(value); // 255
```

## getGeoTiffValues

Extracts values at specific latitude and longitude coordinates from a GeoTIFF
image. This function works in conjunction with the `getGeoTiffDetails` function,
using the details returned by it.

### Signature

```typescript
async function getGeoTiffValues(
  lat: number,
  lon: number,
  geoTiffDetails: {
    image: GeoTIFFImage;
    bbox: number[];
    pixelWidth: number;
    pixelHeight: number;
    bboxWidth: number;
    bboxHeight: number;
  },
): Promise<number | TypedArray>;
```

### Parameters

- **`lat`**: - The latitude coordinate for which to extract the value.
- **`lon`**: - The longitude coordinate for which to extract the value.
- **`geoTiffDetails`**: - An object containing the GeoTIFF image details,
  typically obtained from `getGeoTiffDetails`.

### Returns

A Promise that resolves to the pixel value at the specified coordinates, or a
`TypedArray` if multiple bands are present.

### Throws

- **`Error`**: If the coordinates are outside the GeoTIFF's bounding box or if
  there's an issue reading the raster data.

### Examples

```ts
// Basic usage

const geoTiffDetails = await getGeoTiffDetails("./some-file.tif");
const value = await getGeoTiffValues(45.50, -73.57, geoTiffDetails);
console.log(value); // 255
```

## styledLayerDescriptor

Generates an OpenGIS Styled Layer Descriptor (SLD) XML string, encoded for use
in a URL. This function is particularly useful for dynamically styling Web Map
Service (WMS) layers, allowing for custom color scales and visual
representations of geospatial data directly through the WMS request.

The SLD specifies how a map layer should be rendered. This function focuses on
creating a `ColorMap` within the SLD, which defines a gradient of colors based
on data values. This is commonly used for visualizing continuous data, such as
temperature, elevation, or precipitation, on a map.

### Signature

```typescript
function styledLayerDescriptor(
  layer: string,
  colorScale: { color: string; value: number }[],
): string;
```

### Parameters

- **`layer`**: - The name of the WMS layer to which this SLD will be applied
  (e.g., `"GDPS.ETA_TT"`).
- **`colorScale`**: - An array of objects, where each object defines a `color`
  (hex code) and a `value` (the data threshold for that color). The function
  will sort these entries by value in ascending order to create a proper color
  gradient.

### Returns

A URL-encoded XML string representing the Styled Layer Descriptor.

### Examples

```ts
// Returns the SLD for the GDPS.ETA_TT layer with a color scale going from blue to red.
const sld = styledLayerDescriptor("GDPS.ETA_TT", [
  { color: "#550c24", value: 100 },
  { color: "#7f2e34", value: 30 },
  { color: "#c26847", value: 20 },
  { color: "#bdbb7a", value: 10 },
  { color: "#e0e9f0", value: 0 },
  { color: "#97b4cd", value: -10 },
  { color: "#5881a1", value: -20 },
  { color: "#334f60", value: -30 },
  { color: "#21353f", value: -100 },
]);

// The sld can now be used in a WMS request as SLD_BODY.
const url =
  `https://geo.weather.gc.ca/geomet?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&BBOX=-90,-180,90,180&CRS=EPSG:4326&WIDTH=2400&HEIGHT=1200&LAYERS=GDPS.ETA_TT&FORMAT=image/jpeg&SLD_BODY=${sld}`;
console.log(url);
```
