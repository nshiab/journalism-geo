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

Use `import`
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
