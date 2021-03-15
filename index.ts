import { transform } from '@linaria/babel'
import type { Options as LinariaOptions } from '@linaria/babel/types'
import type { Plugin, OnLoadArgs } from 'esbuild'
import * as fs from 'fs'
import * as path from 'path'

const name = 'esbuild-plugin-linaria'

interface EsbuildPluginLinariaOptions {
  readonly filter?: RegExp
  readonly preprocess?: (code: string, args: OnLoadArgs) => string
  readonly linariaOptions?: LinariaOptions
}

interface EsbuildPluginLinaria {
  (options?: EsbuildPluginLinariaOptions): Plugin
  default: EsbuildPluginLinaria
}

const plugin: EsbuildPluginLinaria = ({ filter, preprocess, linariaOptions } = {}) => ({
  name,
  setup(build) {
    const cssFileContentsMap = new Map<string, string>()

    build.onLoad({ filter: filter ?? /\.[jt]sx?$/ }, async args => {
      const _sourceCode = await fs.promises.readFile(args.path, 'utf8')
      const sourceCode = preprocess ? preprocess(_sourceCode, args) : _sourceCode
      try {
        let { cssText, code } = transform(sourceCode, {
          filename: args.path,
          inputSourceMap: linariaOptions?.inputSourceMap,
          preprocessor: linariaOptions?.preprocessor,
          pluginOptions: linariaOptions?.pluginOptions ?? {
            babelOptions: {
              presets: ['@babel/preset-react', '@babel/preset-typescript'],
            },
          },
        })
        if (cssText) {
          const cssFilename = `${args.path}.${name}.css`
          cssFileContentsMap.set(cssFilename, cssText)
          code = `import '${cssFilename}'\n${code}`
        }
        return {
          contents: code,
          loader: path.extname(args.path).slice(1) as 'js' | 'jsx' | 'ts' | 'tsx',
        }
      } catch (error) {
        return { errors: [{ text: error.message }] }
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
