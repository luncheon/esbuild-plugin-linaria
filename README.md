# esbuild-plugin-linaria

An unofficial and experimental [esbuild](https://esbuild.github.io/) plugin for [Linaria](https://linaria.dev/).

## Installation

```sh
$ npm i -D esbuild luncheon/esbuild-plugin-linaria
```

## Usage Example

- build.js

```js
const esbuild = require('esbuild')
const linariaPlugin = require('@luncheon/esbuild-plugin-linaria')

// set stylis options as needed
const stylis = require('stylis')
stylis.set({ prefix: false })

esbuild.build({
  entryPoints: ['src/app.ts'],
  outdir: 'dist',
  bundle: true,
  minify: true,
  plugins: [linariaPlugin()],
})
```

- src/app.ts

```tsx
import { css } from '@linaria/core'

document.body.className = css`
  display: grid;

  ::before {
    content: '';
  }
`
```

Run build.js

```sh
$ node build.js
```

Then two files will be output

- dist/app.js

```js
(()=>{document.body.className="a16lghq5";})();
```

- dist/app.css

```css
.a16lghq5{display:grid}.a16lghq5::before{content:"";}
```

## Options

The following are the options for this plugin and their default values.

```js
linariaPlugin({
  filter: /\.[jt]sx?$/,
  preprocessor: 'stylis',
  pluginOptions: {
    babelOptions: {
      plugins: [
        ['@babel/plugin-syntax-typescript', { isTSX: filename.endsWith('x') }],
      ],
    },
  },
})
```

`filter` is the option for esbuild.  
`preprocessor` and `pluginOptions` are the options for Linaria.

See:

- `filter`:  
  https://esbuild.github.io/plugins/#filters
- `preprocessor`:  
  https://github.com/callstack/linaria/blob/master/docs/BUNDLERS_INTEGRATION.md#options
- `pluginOptions`:  
  https://github.com/callstack/linaria/blob/master/docs/CONFIGURATION.md#options

## License

[WTFPL](http://www.wtfpl.net/)

