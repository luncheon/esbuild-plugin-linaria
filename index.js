"use strict";
const babel_1 = require("@linaria/babel");
const fs = require("fs");
const path = require("path");
const name = 'esbuild-plugin-linaria';
const plugin = ({ filter, preprocessor, pluginOptions } = {}) => ({
    name,
    setup(build) {
        const cssFileContentsMap = new Map();
        build.onLoad({ filter: filter ?? /\.[jt]sx?$/ }, async ({ path: filename }) => {
            const sourceCode = await fs.promises.readFile(filename, 'utf8');
            try {
                let { cssText, code } = babel_1.transform(sourceCode, {
                    filename,
                    preprocessor,
                    pluginOptions: pluginOptions ?? {
                        babelOptions: {
                            presets: ['@babel/preset-react', '@babel/preset-typescript'],
                        },
                    },
                });
                if (cssText) {
                    const cssFilename = `${filename}.${name}.css`;
                    cssFileContentsMap.set(cssFilename, cssText);
                    code = `import '${cssFilename}'\n${code}`;
                }
                return {
                    contents: code,
                    loader: path.extname(filename).slice(1),
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
