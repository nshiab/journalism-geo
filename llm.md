**Journalism Geo v1.0.24**

***

# The Journalism Library (geo)

Useful TypeScript functions for wrangling geospatial data in journalism projects.
Part of the [journalism library](https://github.com/nshiab/journalism).

The library is maintained by [Nael Shiab](https://naelshiab.com/), computational
journalist and senior data producer for [CBC News](https://www.cbc.ca/news).

> [!TIP]
> To learn how to use this library and more, check out
> [Code Like a Journalist](https://www.code-like-a-journalist.com/), a free and
> open-source data analysis and data visualization course in TypeScript. You
> might also find
> [simple-data-analysis](https://github.com/nshiab/simple-data-analysis) useful.

## Installation

Requires **Node.js 24.21.0 or later**. Use `import`
and set `"type": "module"` in your project's `package.json`.

```sh
npm install @nshiab/journalism-geo
```

```ts
import { getGeoTiffDetails } from "@nshiab/journalism-geo";

const details = await getGeoTiffDetails("./data/elevation.tif");
console.log(details.bbox);
```

For browser projects, import from `@nshiab/journalism-geo/web`:

```ts
import { distance } from "@nshiab/journalism-geo/web";

console.log(distance(-73.5673, 45.5017, -79.3832, 43.6532, { decimals: 0 })); // 504
```

To start a data project with folders, configuration and documentation for AI
agents, run:

```sh
npx @nshiab/setup-data-project
```

## Documentation

- [Documentation](https://nshiab.github.io/journalism-geo/)
- [llms.txt — Documentation index for AI agents](https://nshiab.github.io/journalism-geo/llms.txt)
- [llm.md — Complete Markdown reference](https://nshiab.github.io/journalism-geo/llm.md),
  for AI assistants or offline reading
- [npm package](https://www.npmjs.com/package/@nshiab/journalism-geo)

See
[CONTRIBUTING.md](https://github.com/nshiab/journalism-geo/blob/main/CONTRIBUTING.md)
for development commands.

## Geo

### GeoToBlenderFlatProjection

> **GeoToBlenderFlatProjection** = (`coordinates`) => \[`number`, `number`\] \| `null`

A fitted flat projection that converts longitude/latitude coordinates to x/y coordinates.

#### Parameters

##### coordinates

\[`number`, `number`\]

#### Returns

\[`number`, `number`\] \| `null`

***

### GeoToBlenderOptions

> **GeoToBlenderOptions** = `object`

Options for converting GeoJSON borders into a Blender OBJ file.

#### Properties

##### decimals?

> `optional` **decimals?**: `number`

The number of decimal places to round OBJ coordinates to.

##### maxSegmentLength?

> `optional` **maxSegmentLength?**: `number`

The maximum angular distance, in degrees, between generated vertices for `"orthographic"`.
By default, segments are not densified.

##### radius?

> `optional` **radius?**: `number`

For `"orthographic"`, the radius of the sphere in Blender units.

###### Default

```ts
10
```

***

### GeoToBlenderPointFlatProjection

> **GeoToBlenderPointFlatProjection** = (`coordinates`) => \[`number`, `number`\] \| `null`

A pre-fitted flat projection that converts longitude/latitude coordinates to x/y coordinates.

#### Parameters

##### coordinates

\[`number`, `number`\]

#### Returns

\[`number`, `number`\] \| `null`

***

### GeoToBlenderPointOptions

> **GeoToBlenderPointOptions** = `object`

Options for converting one longitude/latitude coordinate into Blender coordinates.

#### Properties

##### decimals?

> `optional` **decimals?**: `number`

The number of decimal places to round coordinates to.

##### radius?

> `optional` **radius?**: `number`

For `"orthographic"`, the radius of the sphere in Blender units.

###### Default

```ts
10
```

##### toArray?

> `optional` **toArray?**: `boolean`

If `true`, the function returns `[x, y, z]` instead of `{ x, y, z }`.

###### Default

```ts
false
```

***

### GeoToBlenderPointProjection

> **GeoToBlenderPointProjection** = `"orthographic"` \| [`GeoToBlenderPointFlatProjection`](#geotoblenderpointflatprojection)

A projection function or `"orthographic"` for a 3D globe point.

***

### GeoToBlenderProjection

> **GeoToBlenderProjection** = `"orthographic"` \| [`GeoToBlenderFlatProjection`](#geotoblenderflatprojection)

A projection function or `"orthographic"` for 3D globe borders.

***

### distance()

> **distance**(`lon1`, `lat1`, `lon2`, `lat2`, `options?`): `number`

Calculates the Haversine distance between two geographical points (longitude and latitude) in kilometers. The Haversine formula is used to determine the great-circle distance between two points on a sphere given their longitudes and latitudes.

This function is useful for geospatial applications where accurate distance measurements over the Earth's surface are required,.

#### Parameters

##### lon1

`number`

The longitude of the first point.

##### lat1

`number`

The latitude of the first point.

##### lon2

`number`

The longitude of the second point.

##### lat2

`number`

The latitude of the second point.

##### options?

Optional settings for the distance calculation.

###### decimals?

`number`

The number of decimal places to round the result to. If not specified, the result will not be rounded.

#### Returns

`number`

The distance between the two points in kilometers.

#### Examples

```ts
// Basic usage: Calculate the distance between two cities.
// Montreal (-73.5673, 45.5017) and Toronto (-79.3832, 43.6532)
const dist = distance(-73.5673, 45.5017, -79.3832, 43.6532);
console.log(dist); // Approximately 504.3 km
```

```ts
// Rounding the result to a whole number.
const roundedDist = distance(-73.5673, 45.5017, -79.3832, 43.6532, { decimals: 0 });
console.log(roundedDist); // 504 km
```

***

### geoTo3D()

Converts geographical coordinates (longitude and latitude) into 3D Cartesian (x, y, z) coordinates based on a specified radius.

The conversion assumes a spherical Earth model. The `radius` parameter determines the size of the sphere on which the points are projected.

#### Param

**lon**

The longitude of the geographical point, in degrees.

#### Param

**lat**

The latitude of the geographical point, in degrees.

#### Param

**radius**

The radius of the sphere on which to project the coordinates.

#### Param

**options**

Optional settings for the conversion.

#### Param

**options.decimals**

The number of decimal places to round the x, y, and z coordinates to. If not specified, no rounding is applied.

#### Param

**options.toArray**

If `true`, the function will return the coordinates as an array `[x, y, z]` instead of an object `{ x, y, z }`. Defaults to `false`.

#### Examples

```ts
// Basic usage: Convert geographical coordinates to 3D object coordinates.
// Longitude: -73.5674 (Montreal), Latitude: 45.5019 (Montreal), Radius: 1
const coordsObject = geoTo3D(-73.5674, 45.5019, 1, { decimals: 2 });
console.log(coordsObject); // Expected output: { x: -0.67, y: 0.71, z: 0.2 }
```

```ts
// Convert geographical coordinates to 3D array coordinates.
const coordsArray = geoTo3D(-73.5674, 45.5019, 1, { decimals: 2, toArray: true });
console.log(coordsArray); // Expected output: [-0.67, 0.71, 0.2]
```

```ts
// Using a larger radius for visualization purposes.
const earthCoords = geoTo3D(0, 0, 6371, { decimals: 0 }); // Earth's approximate radius in km
console.log(earthCoords); // Expected output: { x: 0, y: 6371, z: 0 } (for 0,0 lat/lon)
```

#### Call Signature

> **geoTo3D**(`lon`, `lat`, `radius`, `options`): \[`number`, `number`, `number`\]

Converts geographical coordinates (longitude and latitude) into 3D Cartesian (x, y, z) coordinates based on a specified radius.

The conversion assumes a spherical Earth model. The `radius` parameter determines the size of the sphere on which the points are projected.

##### Parameters

###### lon

`number`

The longitude of the geographical point, in degrees.

###### lat

`number`

The latitude of the geographical point, in degrees.

###### radius

`number`

The radius of the sphere on which to project the coordinates.

###### options

Optional settings for the conversion.

###### decimals?

`number`

The number of decimal places to round the x, y, and z coordinates to. If not specified, no rounding is applied.

###### toArray

`true`

If `true`, the function will return the coordinates as an array `[x, y, z]` instead of an object `{ x, y, z }`. Defaults to `false`.

##### Returns

\[`number`, `number`, `number`\]

An object `{ x, y, z }` or an array `[x, y, z]` representing the 3D Cartesian coordinates.

##### Examples

```ts
// Basic usage: Convert geographical coordinates to 3D object coordinates.
// Longitude: -73.5674 (Montreal), Latitude: 45.5019 (Montreal), Radius: 1
const coordsObject = geoTo3D(-73.5674, 45.5019, 1, { decimals: 2 });
console.log(coordsObject); // Expected output: { x: -0.67, y: 0.71, z: 0.2 }
```

```ts
// Convert geographical coordinates to 3D array coordinates.
const coordsArray = geoTo3D(-73.5674, 45.5019, 1, { decimals: 2, toArray: true });
console.log(coordsArray); // Expected output: [-0.67, 0.71, 0.2]
```

```ts
// Using a larger radius for visualization purposes.
const earthCoords = geoTo3D(0, 0, 6371, { decimals: 0 }); // Earth's approximate radius in km
console.log(earthCoords); // Expected output: { x: 0, y: 6371, z: 0 } (for 0,0 lat/lon)
```

#### Call Signature

> **geoTo3D**(`lon`, `lat`, `radius`, `options?`): `object`

Converts geographical coordinates (longitude and latitude) into 3D Cartesian (x, y, z) coordinates based on a specified radius.

The conversion assumes a spherical Earth model. The `radius` parameter determines the size of the sphere on which the points are projected.

##### Parameters

###### lon

`number`

The longitude of the geographical point, in degrees.

###### lat

`number`

The latitude of the geographical point, in degrees.

###### radius

`number`

The radius of the sphere on which to project the coordinates.

###### options?

Optional settings for the conversion.

###### decimals?

`number`

The number of decimal places to round the x, y, and z coordinates to. If not specified, no rounding is applied.

###### toArray?

`false`

If `true`, the function will return the coordinates as an array `[x, y, z]` instead of an object `{ x, y, z }`. Defaults to `false`.

##### Returns

`object`

An object `{ x, y, z }` or an array `[x, y, z]` representing the 3D Cartesian coordinates.

###### x

> **x**: `number`

###### y

> **y**: `number`

###### z

> **z**: `number`

##### Examples

```ts
// Basic usage: Convert geographical coordinates to 3D object coordinates.
// Longitude: -73.5674 (Montreal), Latitude: 45.5019 (Montreal), Radius: 1
const coordsObject = geoTo3D(-73.5674, 45.5019, 1, { decimals: 2 });
console.log(coordsObject); // Expected output: { x: -0.67, y: 0.71, z: 0.2 }
```

```ts
// Convert geographical coordinates to 3D array coordinates.
const coordsArray = geoTo3D(-73.5674, 45.5019, 1, { decimals: 2, toArray: true });
console.log(coordsArray); // Expected output: [-0.67, 0.71, 0.2]
```

```ts
// Using a larger radius for visualization purposes.
const earthCoords = geoTo3D(0, 0, 6371, { decimals: 0 }); // Earth's approximate radius in km
console.log(earthCoords); // Expected output: { x: 0, y: 6371, z: 0 } (for 0,0 lat/lon)
```

***

### geoToBlender()

> **geoToBlender**(`geojsonPath`, `projection`, `outputPath`, `options?`): `Promise`\<`string`\>

Converts GeoJSON borders into an OBJ file that can be imported in Blender.

Polygon rings, MultiPolygon rings, LineStrings, and MultiLineStrings are exported as OBJ line geometry.
Polygon and MultiPolygon rings are always closed into loops (a closing coordinate is appended when the source data omits it), while LineStrings and MultiLineStrings are left exactly as provided.
Flat projection functions are placed on Blender's X/Y plane with Z up and north toward positive Y.
The `"orthographic"` projection exports borders in 3D on a sphere using `geoTo3D`.
Set `maxSegmentLength` to add extra vertices along long orthographic segments.

When fitting a flat projection with `fitExtent`/`fitSize`, run the GeoJSON through `rewind` from `@nshiab/journalism-dataviz` first. Many data sources wind their polygons the wrong way for `d3-geo`, which makes the fit collapse to a near-zero scale and produces an empty-looking OBJ.

#### Parameters

##### geojsonPath

`string`

The path to the GeoJSON file to convert.

##### projection

`"orthographic"` \| ((`coordinates`) => \[`number`, `number`\] \| `null`)

A flat projection function or `"orthographic"` for 3D globe borders.

##### outputPath

`string`

The path where the OBJ file will be written.

##### options?

Optional settings for orthographic radius, coordinate rounding, and orthographic segment densification.

###### decimals?

`number`

The number of decimal places to round OBJ coordinates to.

###### maxSegmentLength?

`number`

The maximum angular distance, in degrees, between generated vertices for `"orthographic"`.
By default, segments are not densified.

###### radius?

`number`

For `"orthographic"`, the radius of the sphere in Blender units.

**Default**

```ts
10
```

#### Returns

`Promise`\<`string`\>

A Promise that resolves to the output path.

#### Example

```ts
import { geoToBlender } from "@nshiab/journalism-geo";
import { rewind } from "@nshiab/journalism-dataviz";
import { geoConicConformal } from "d3-geo";
import { readFile } from "node:fs/promises";

const geojsonPath = "./data/canada.geojson";
const geojson = JSON.parse(await readFile(geojsonPath, "utf8"));
// Rewind so fitExtent measures the real extent instead of collapsing.
const domain = rewind(geojson);
const projection = geoConicConformal()
  .rotate([100, -60])
  .fitExtent([[-5, -5], [5, 5]], domain);
await geoToBlender(geojsonPath, projection, "./output/canada.obj", {
  decimals: 3,
});
```

***

### geoToBlenderPoint()

#### Call Signature

> **geoToBlenderPoint**(`lon`, `lat`, `projection`, `options?`): `object`

Converts one longitude/latitude coordinate into Blender coordinates.

Flat projection functions are placed on Blender's X/Y plane with Z up and north toward positive Y.
The `"orthographic"` projection exports the coordinate in 3D on a sphere using `geoTo3D`.

When fitting a flat projection with `fitExtent`/`fitSize`, run the GeoJSON through `rewind` from `@nshiab/journalism-dataviz` first. Many data sources wind their polygons the wrong way for `d3-geo`, which makes the fit collapse to a near-zero scale and places every point at nearly the same spot. Use the same fitted projection here as the one passed to `geoToBlender` so the point lines up with the borders.

##### Parameters

###### lon

`number`

The longitude of the geographical point, in degrees.

###### lat

`number`

The latitude of the geographical point, in degrees.

###### projection

`"orthographic"` \| ((`coordinates`) => \[`number`, `number`\] \| `null`)

A flat projection function or `"orthographic"` for a 3D globe point.

###### options?

Optional settings for orthographic radius, coordinate rounding, and return shape.

###### decimals?

`number`

The number of decimal places to round coordinates to.

###### radius?

`number`

For `"orthographic"`, the radius of the sphere in Blender units.

**Default**

```ts
10
```

###### toArray?

`false`

If `true`, the function returns `[x, y, z]` instead of `{ x, y, z }`.

**Default**

```ts
false
```

##### Returns

`object`

Blender coordinates.

###### x

> **x**: `number`

###### y

> **y**: `number`

###### z

> **z**: `number`

##### Example

```ts
import { geoToBlenderPoint } from "@nshiab/journalism-geo";
import { rewind } from "@nshiab/journalism-dataviz";
import { geoConicConformal } from "d3-geo";
import { readFile } from "node:fs/promises";

const geojson = JSON.parse(await readFile("./data/canada.geojson", "utf8"));
// Rewind so fitExtent measures the real extent instead of collapsing.
const domain = rewind(geojson);
const projection = geoConicConformal()
  .rotate([100, -60])
  .fitExtent([[-5, -5], [5, 5]], domain);
const point = geoToBlenderPoint(-73.5674, 45.5019, projection, {
  decimals: 3,
});
```

#### Call Signature

> **geoToBlenderPoint**(`lon`, `lat`, `projection`, `options`): \[`number`, `number`, `number`\]

Converts one longitude/latitude coordinate into Blender coordinates.

Flat projection functions are placed on Blender's X/Y plane with Z up and north toward positive Y.
The `"orthographic"` projection exports the coordinate in 3D on a sphere using `geoTo3D`.

##### Parameters

###### lon

`number`

The longitude of the geographical point, in degrees.

###### lat

`number`

The latitude of the geographical point, in degrees.

###### projection

`"orthographic"` \| ((`coordinates`) => \[`number`, `number`\] \| `null`)

A flat projection function or `"orthographic"` for a 3D globe point.

###### options

Optional settings for orthographic radius, coordinate rounding, and return shape.

###### decimals?

`number`

The number of decimal places to round coordinates to.

###### radius?

`number`

For `"orthographic"`, the radius of the sphere in Blender units.

**Default**

```ts
10
```

###### toArray

`true`

If `true`, the function returns `[x, y, z]` instead of `{ x, y, z }`.

**Default**

```ts
false
```

##### Returns

\[`number`, `number`, `number`\]

Blender coordinates.

##### Example

```ts
import { geoToBlenderPoint } from "@nshiab/journalism-geo";

const point = geoToBlenderPoint(-73.5674, 45.5019, "orthographic", {
  radius: 10,
  decimals: 3,
  toArray: true,
});
```

***

### getClosest()

#### Call Signature

> **getClosest**\<`T`\>(`lon`, `lat`, `geoItems`, `getItemLon`, `getItemLat`, `options?`): `T`

Finds the geographical item closest to a given reference point (longitude and latitude) from a list of geographical items.

The function calculates the distance between the reference point and each item in the `geoItems` array using the Haversine formula (via the `distance` function). It then returns the item with the minimum distance.

Optionally, you can choose to add the calculated distance as a new property to the returned closest item. If the `geoItems` have a `properties` key (common in GeoJSON-like structures), the distance will be added there; otherwise, it will be added directly to the item object.

##### Type Parameters

###### T

`T`

##### Parameters

###### lon

`number`

The longitude of the reference point.

###### lat

`number`

The latitude of the reference point.

###### geoItems

`T`[]

An array of geographical items to search through. Each item should contain properties that can be accessed by `getItemLon` and `getItemLat` to retrieve its longitude and latitude.

###### getItemLon

(`item`) => `number`

A function that takes an item from `geoItems` and returns its longitude.

###### getItemLat

(`item`) => `number`

A function that takes an item from `geoItems` and returns its latitude.

###### options?

Optional settings for the search.

###### addDistance?

`false`

If `true`, the calculated distance to the closest item will be added as a property (`distance`) to the returned object. Defaults to `false`.

###### decimals?

`number`

The number of decimal places to round the calculated distance to, if `addDistance` is `true`.

##### Returns

`T`

The geographical item from `geoItems` that is closest to the reference point. If `addDistance` is `true`, the returned object will also include the `distance` property.

##### Examples

```ts
// Basic usage: Find the closest city to Ottawa.
const cities = [
  { name: "Montreal", lon: -73.5673, lat: 45.5017 },
  { name: "Toronto", lon: -79.3832, lat: 43.6532 },
  { name: "Vancouver", lon: -123.1207, lat: 49.2827 }
];
const ottawa = { lon: -75.6972, lat: 45.4215 };

const closestCity = getClosest(
  ottawa.lon,
  ottawa.lat,
  cities,
  (d) => d.lon,
  (d) => d.lat,
  { addDistance: true, decimals: 2 }
);

console.log(closestCity);
// Expected output: { name: "Montreal", lon: -73.5673, lat: 45.5017, distance: 160.69 }
```

```ts
// Finding the closest point in a GeoJSON FeatureCollection.
const featureCollection = {
  type: "FeatureCollection",
  features: [
    { type: "Feature", properties: { name: "Park A" }, geometry: { type: "Point", coordinates: [-74.0, 40.7] } },
    { type: "Feature", properties: { name: "Park B" }, geometry: { type: "Point", coordinates: [-73.9, 40.8] } }
  ]
};
const userLocation = { lon: -73.95, lat: 40.75 };

const closestPark = getClosest(
  userLocation.lon,
  userLocation.lat,
  featureCollection.features,
  (f) => f.geometry.coordinates[0],
  (f) => f.geometry.coordinates[1],
  { addDistance: true }
);

console.log(closestPark);
// Expected output: { type: "Feature", properties: { name: "Park B", distance: ... }, geometry: { ... } }
```

#### Call Signature

> **getClosest**\<`T`\>(`lon`, `lat`, `geoItems`, `getItemLon`, `getItemLat`, `options`): `T` & `object`

Finds the geographical item closest to a given reference point and adds distance to the properties object.

##### Type Parameters

###### T

`T` *extends* `object`

##### Parameters

###### lon

`number`

The longitude of the reference point.

###### lat

`number`

The latitude of the reference point.

###### geoItems

`T`[]

An array of geographical items with properties objects.

###### getItemLon

(`item`) => `number`

A function that returns longitude from an item.

###### getItemLat

(`item`) => `number`

A function that returns latitude from an item.

###### options

Settings with addDistance: true for items with properties.

###### addDistance

`true`

###### decimals?

`number`

##### Returns

`T` & `object`

The closest item with distance added to its properties object.

#### Call Signature

> **getClosest**\<`T`\>(`lon`, `lat`, `geoItems`, `getItemLon`, `getItemLat`, `options`): `T` & `object`

Finds the geographical item closest to a given reference point and adds distance directly to the item.

##### Type Parameters

###### T

`T`

##### Parameters

###### lon

`number`

The longitude of the reference point.

###### lat

`number`

The latitude of the reference point.

###### geoItems

`T`[]

An array of geographical items without properties objects.

###### getItemLon

(`item`) => `number`

A function that returns longitude from an item.

###### getItemLat

(`item`) => `number`

A function that returns latitude from an item.

###### options

Settings with addDistance: true for items without properties.

###### addDistance

`true`

###### decimals?

`number`

##### Returns

`T` & `object`

The closest item with distance added directly to the item.

***

### getGeoTiffDetails()

> **getGeoTiffDetails**(`path`): `Promise`\<\{ `bbox`: `number`[]; `bboxHeight`: `number`; `bboxWidth`: `number`; `image`: `GeoTIFFImage`; `pixelHeight`: `number`; `pixelWidth`: `number`; \}\>

Extracts detailed information from a GeoTIFF file, which can then be used with the `getGeoTiffValues` function.

#### Parameters

##### path

`string`

The absolute path to the GeoTIFF file.

#### Returns

`Promise`\<\{ `bbox`: `number`[]; `bboxHeight`: `number`; `bboxWidth`: `number`; `image`: `GeoTIFFImage`; `pixelHeight`: `number`; `pixelWidth`: `number`; \}\>

A Promise that resolves to an object containing the GeoTIFF image, bounding box, pixel dimensions, and bounding box dimensions.

#### Examples

```ts
// Basic usage
const geoTiffDetails = await getGeoTiffDetails("./some-file.tif")
console.log(geoTiffDetails.bbox) // [ -73.8, 45.4, -73.5, 45.6 ]
```

```ts
// Using the output with `getGeoTiffValues`

const geoTiffDetails = await getGeoTiffDetails("./some-file.tif")
const value = await getGeoTiffValues(45.50, -73.57, geoTiffDetails)
console.log(value) // 255
```

***

### getGeoTiffValues()

> **getGeoTiffValues**(`lat`, `lon`, `geoTiffDetails`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\> \| `Uint16Array`\<`ArrayBufferLike`\> \| `Uint32Array`\<`ArrayBufferLike`\> \| `Int8Array`\<`ArrayBufferLike`\> \| `Int16Array`\<`ArrayBufferLike`\> \| `Int32Array`\<`ArrayBufferLike`\> \| `Float32Array`\<`ArrayBufferLike`\> \| `Float64Array`\<`ArrayBufferLike`\>\>

Extracts values at specific latitude and longitude coordinates from a GeoTIFF image. This function works in conjunction with the `getGeoTiffDetails` function, using the details returned by it.

#### Parameters

##### lat

`number`

The latitude coordinate for which to extract the value.

##### lon

`number`

The longitude coordinate for which to extract the value.

##### geoTiffDetails

An object containing the GeoTIFF image details, typically obtained from `getGeoTiffDetails`.

###### bbox

`number`[]

###### bboxHeight

`number`

###### bboxWidth

`number`

###### image

`unknown`

###### pixelHeight

`number`

###### pixelWidth

`number`

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\> \| `Uint16Array`\<`ArrayBufferLike`\> \| `Uint32Array`\<`ArrayBufferLike`\> \| `Int8Array`\<`ArrayBufferLike`\> \| `Int16Array`\<`ArrayBufferLike`\> \| `Int32Array`\<`ArrayBufferLike`\> \| `Float32Array`\<`ArrayBufferLike`\> \| `Float64Array`\<`ArrayBufferLike`\>\>

A Promise that resolves to the pixel value at the specified coordinates, or a `TypedArray` if multiple bands are present.

#### Example

```ts
// Basic usage

const geoTiffDetails = await getGeoTiffDetails("./some-file.tif")
const value = await getGeoTiffValues(45.50, -73.57, geoTiffDetails)
console.log(value) // 255
```

#### Throws

If the coordinates are outside the GeoTIFF's bounding box or if there's an issue reading the raster data.

***

### styledLayerDescriptor()

> **styledLayerDescriptor**(`layer`, `colorScale`): `string`

Generates an OpenGIS Styled Layer Descriptor (SLD) XML string, encoded for use in a URL. This function is particularly useful for dynamically styling Web Map Service (WMS) layers, allowing for custom color scales and visual representations of geospatial data directly through the WMS request.

The SLD specifies how a map layer should be rendered. This function focuses on creating a `ColorMap` within the SLD, which defines a gradient of colors based on data values. This is commonly used for visualizing continuous data, such as temperature, elevation, or precipitation, on a map.

#### Parameters

##### layer

`string`

The name of the WMS layer to which this SLD will be applied (e.g., `"GDPS.ETA_TT"`).

##### colorScale

`object`[]

An array of objects, where each object defines a `color` (hex code) and a `value` (the data threshold for that color). The function will sort these entries by value in ascending order to create a proper color gradient.

#### Returns

`string`

A URL-encoded XML string representing the Styled Layer Descriptor.

#### Example

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
const url = `https://geo.weather.gc.ca/geomet?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&BBOX=-90,-180,90,180&CRS=EPSG:4326&WIDTH=2400&HEIGHT=1200&LAYERS=GDPS.ETA_TT&FORMAT=image/jpeg&SLD_BODY=${sld}`;
console.log(url);
```
