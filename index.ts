import { transform as linariaTransform } from '@linaria/babel'
import type { Options as LinariaOptions } from '@linaria/babel/types'
import type { OnLoadArgs, OnLoadResult, Plugin, PluginBuild } from 'esbuild'
import * as fs from 'fs'
import * as path from 'path'

interface EsbuildPipeableTransformArgs {
  readonly args: OnLoadArgs
  readonly contents: string
}

interface EsbuildPipeablePlugin extends Plugin {
  setup(build: PluginBuild, pipe: { transform: EsbuildPipeableTransformArgs }): OnLoadResult
  setup(build: PluginBuild): void
}

interface EsbuildPluginLinariaOptions {
  readonly filter?: RegExp
  readonly preprocess?: (code: string, args: OnLoadArgs) => string
  readonly linariaOptions?: LinariaOptions
}

interface EsbuildPluginLinaria {
  (options?: EsbuildPluginLinariaOptions): EsbuildPipeablePlugin
  default: EsbuildPluginLinaria
}

const pluginName = 'esbuild-plugin-linaria'

const plugin: EsbuildPluginLinaria = ({ filter, preprocess, linariaOptions } = {}) => {
  const cssFileContentsMap = new Map<string, string>()
  const transform = ({ args, contents }: EsbuildPipeableTransformArgs) => {
    contents = preprocess ? preprocess(contents, args) : contents
    let { cssText, code } = linariaTransform(contents, {
      filename: args.path,
      inputSourceMap: linariaOptions?.inputSourceMap,
      preprocessor: linariaOptions?.preprocessor,
      pluginOptions: linariaOptions?.pluginOptions ?? {
        babelOptions: { presets: ['@babel/preset-react', '@babel/preset-typescript'] },
      },
    })
    if (cssText) {
      const cssFilename = `${args.path}.${pluginName}.css`
      cssFileContentsMap.set(cssFilename, cssText)
      code = `import '${cssFilename}'\n${code}`
    }
    return { contents: code, loader: path.extname(args.path).slice(1) as 'js' | 'jsx' | 'ts' | 'tsx' }
  }
  return {
    name: pluginName,
    setup: ((build: PluginBuild, pipe?: { transform: EsbuildPipeableTransformArgs }) => {
      if (pipe?.transform) {
        return transform(pipe.transform)
      }
      build.onLoad({ filter: filter ?? /\.[jt]sx?$/ }, async args => {
        try {
          return transform({ args, contents: await fs.promises.readFile(args.path, 'utf8') })
        } catch (error) {
          return { errors: [{ text: error.message }] }
        }
      })
      build.onResolve({ filter: RegExp(String.raw`\.${pluginName}\.css`) }, ({ path }) => ({ path, namespace: pluginName }))
      build.onLoad({ filter: RegExp(String.raw`\.${pluginName}\.css`), namespace: pluginName }, ({ path }) => {
        const contents = cssFileContentsMap.get(path)
        return contents ? { contents, loader: 'css' } : undefined
      })
    }) as EsbuildPipeablePlugin['setup'],
  }
}

export = plugin.default = plugin
