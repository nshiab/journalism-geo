[**Journalism Geo v1.0.23**](../index.md)

***

[Journalism Geo](../globals.md) / GeoToBlenderPointOptions

# Type Alias: GeoToBlenderPointOptions

> **GeoToBlenderPointOptions** = `object`

Options for converting one longitude/latitude coordinate into Blender coordinates.

## Properties

### decimals?

> `optional` **decimals?**: `number`

The number of decimal places to round coordinates to.

***

### radius?

> `optional` **radius?**: `number`

For `"orthographic"`, the radius of the sphere in Blender units.

#### Default

```ts
10
```

***

### toArray?

> `optional` **toArray?**: `boolean`

If `true`, the function returns `[x, y, z]` instead of `{ x, y, z }`.

#### Default

```ts
false
```
