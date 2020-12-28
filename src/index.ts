import { transform } from '@linaria/babel'
import type { Preprocessor } from '@linaria/babel/types'
import type { Plugin } from 'esbuild'
import * as fs from 'fs'
import * as path from 'path'

interface EsbuildLinariaPluginOptions {
  readonly filter?: RegExp
  readonly preprocessor?: Preprocessor
}

interface EsbuildLinariaPlugin {
  (options?: EsbuildLinariaPluginOptions): Plugin
  default: EsbuildLinariaPlugin
}

const name = 'esbuild-plugin-linaria'

const plugin: EsbuildLinariaPlugin = ({ filter, preprocessor } = {}) => ({
  name,
  setup(build) {
    const cssFileContentsMap = new Map<string, string>()

    build.onLoad({ filter: filter ?? /\.[jt]sx?$/ }, async ({ path: filename }) => {
      const sourceCode = await fs.promises.readFile(filename, 'utf8')
      let { cssText, code } = transform(sourceCode, {
        filename,
        preprocessor,
        pluginOptions: {
          babelOptions: {
            plugins: [
              ['@babel/plugin-syntax-typescript', { isTSX: filename.endsWith('x') }],
            ],
          },
        },
      })
      if (cssText) {
        const cssFilename = `${filename}.${name}.css`
        cssFileContentsMap.set(cssFilename, cssText)
        code = `import '${cssFilename}'\n${code}`
      }
      return {
        contents: code,
        loader: path.extname(filename).slice(1) as 'js' | 'jsx' | 'ts' | 'tsx',
      }
    })

    build.onResolve({ filter: RegExp(String.raw`\.${name}\.css`) }, ({ path }) => ({ path, namespace: name }))
    build.onLoad({ filter: RegExp(String.raw`\.${name}\.css`), namespace: name }, ({ path }) => {
      const contents = cssFileContentsMap.get(path)
      return contents ? { contents, loader: 'css' } : undefined
    })
  },
})

export = plugin.default = plugin
