"use strict";
const babel_1 = require("@linaria/babel");
const fs = require("fs");
const path = require("path");
const pluginName = 'esbuild-plugin-linaria';
const plugin = ({ filter, preprocess, linariaOptions } = {}) => {
    const cssFileContentsMap = new Map();
    const transform = ({ args, contents }) => {
        contents = preprocess ? preprocess(contents, args) : contents;
        let { cssText, code } = babel_1.transform(contents, {
            filename: args.path,
            inputSourceMap: linariaOptions?.inputSourceMap,
            preprocessor: linariaOptions?.preprocessor,
            pluginOptions: linariaOptions?.pluginOptions ?? {
                babelOptions: { presets: ['@babel/preset-react', '@babel/preset-typescript'] },
            },
        });
        if (cssText) {
            const cssFilename = `${args.path}.${pluginName}.css`;
            cssFileContentsMap.set(cssFilename, cssText);
            code = `import '${cssFilename}'\n${code}`;
        }
        return { contents: code, loader: path.extname(args.path).slice(1) };
    };
    return {
        name: pluginName,
        setup(build, pipe) {
            if (pipe?.transform) {
                return transform(pipe.transform);
            }
            build.onLoad({ filter: filter ?? /\.[jt]sx?$/ }, async (args) => {
                try {
                    return transform({ args, contents: await fs.promises.readFile(args.path, 'utf8') });
                }
                catch (error) {
                    return { errors: [{ text: error.message }] };
                }
            });
            build.onResolve({ filter: RegExp(String.raw `\.${pluginName}\.css`) }, ({ path }) => ({ path, namespace: pluginName }));
            build.onLoad({ filter: RegExp(String.raw `\.${pluginName}\.css`), namespace: pluginName }, ({ path }) => {
                const contents = cssFileContentsMap.get(path);
                return contents ? { contents, loader: 'css' } : undefined;
            });
        },
    };
};
module.exports = plugin.default = plugin;
