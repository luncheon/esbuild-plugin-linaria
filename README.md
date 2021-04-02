# esbuild-plugin-linaria

An unofficial and experimental [esbuild](https://esbuild.github.io/) plugin for [Linaria](https://linaria.dev/).

## Installation

```sh
$ npm i -D esbuild @luncheon/esbuild-plugin-linaria
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
  preprocess: (code, args) => code,
  linariaOptions: {
    pluginOptions: {
      babelOptions: {
        plugins: [
          presets: ['@babel/preset-react', '@babel/preset-typescript'],
        ],
      },
    },
  },
})
```

- `filter` is an option for esbuild to narrow down the files to which this plugin should be applied.  
  https://esbuild.github.io/plugins/#filters
- `preprocess` callback is called before the source code is transformed by Linaria.
  - The first argument `code` is the source code content.
  - The second argument `args` is the argument passed by esbuild. `args.path` is the file path.
  - It must return source code content string.
- `linariaOptions` is the option for Linaria.
  - `preprocessor`  
    https://github.com/callstack/linaria/blob/master/docs/BUNDLERS_INTEGRATION.md#options
  - `pluginOptions`  
    https://github.com/callstack/linaria/blob/master/docs/CONFIGURATION.md#options

## With `esbuild-plugin-pipe`

If you use this plugin with [`esbuild-plugin-pipe`](https://github.com/nativew/esbuild-plugin-pipe), pass the same plugin instance to both `esbuild-plugin-pipe` and `esbuild`.

```js
import esbuild from 'esbuild'
import pipe from 'esbuild-plugin-pipe'
import linariaPlugin from '@luncheon/esbuild-plugin-linaria'

const linaria = linariaPlugin({ filter: /^$/ })

esbuild.build({
  entryPoints: ['src/app.ts'],
  outdir: 'dist',
  bundle: true,
  minify: true,
  plugins: [
    pipe({
      filter: /\.[jt]sx?$/,
      plugins: [linaria],
    }),
    linaria,
  ],
})
```

## License

[WTFPL](http://www.wtfpl.net/)
