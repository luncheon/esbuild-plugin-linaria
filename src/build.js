const path = require('path')

require('esbuild').buildSync({
  entryPoints: [path.resolve(__dirname, 'index.ts')],
  outfile: path.resolve(__dirname, '../index.js'),
  platform: 'node',
  format: 'cjs',
  external: ['@linaria/babel'],
  bundle: true,
})
