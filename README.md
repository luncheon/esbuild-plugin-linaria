# @luncheon/esbuild-plugin-linaria

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

## License

[WTFPL](http://www.wtfpl.net/)

