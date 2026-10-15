[**Journalism Geo v1.0.23**](../index.md)

***

[Journalism Geo](../globals.md) / GeoToBlenderOptions

# Type Alias: GeoToBlenderOptions

> **GeoToBlenderOptions** = `object`

Options for converting GeoJSON borders into a Blender OBJ file.

## Properties

### decimals?

> `optional` **decimals?**: `number`

The number of decimal places to round OBJ coordinates to.

***

### maxSegmentLength?

> `optional` **maxSegmentLength?**: `number`

The maximum angular distance, in degrees, between generated vertices for `"orthographic"`.
By default, segments are not densified.

***

### radius?

> `optional` **radius?**: `number`

For `"orthographic"`, the radius of the sphere in Blender units.

#### Default

```ts
10
```
