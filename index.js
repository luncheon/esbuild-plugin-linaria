"use strict";
const babel_1 = require("@linaria/babel");
const fs = require("fs");
const path = require("path");
const name = 'esbuild-plugin-linaria';
const plugin = ({ filter, preprocess, linariaOptions } = {}) => ({
    name,
    setup(build) {
        const cssFileContentsMap = new Map();
        build.onLoad({ filter: filter ?? /\.[jt]sx?$/ }, async (args) => {
            const _sourceCode = await fs.promises.readFile(args.path, 'utf8');
            const sourceCode = preprocess ? preprocess(_sourceCode, args) : _sourceCode;
            try {
                let { cssText, code } = babel_1.transform(sourceCode, {
                    filename: args.path,
                    inputSourceMap: linariaOptions?.inputSourceMap,
                    preprocessor: linariaOptions?.preprocessor,
                    pluginOptions: linariaOptions?.pluginOptions ?? {
                        babelOptions: {
                            presets: ['@babel/preset-react', '@babel/preset-typescript'],
                        },
                    },
                });
                if (cssText) {
                    const cssFilename = `${args.path}.${name}.css`;
                    cssFileContentsMap.set(cssFilename, cssText);
                    code = `import '${cssFilename}'\n${code}`;
                }
                return {
                    contents: code,
                    loader: path.extname(args.path).slice(1),
                };
            }
            catch (error) {
                return { errors: [{ text: error.message }] };
            }
        });
        build.onResolve({ filter: RegExp(String.raw `\.${name}\.css`) }, ({ path }) => ({ path, namespace: name }));
        build.onLoad({ filter: RegExp(String.raw `\.${name}\.css`), namespace: name }, ({ path }) => {
            const contents = cssFileContentsMap.get(path);
            return contents ? { contents, loader: 'css' } : undefined;
        });
    },
});
module.exports = plugin.default = plugin;
