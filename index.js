"use strict";
const babel_1 = require("@linaria/babel");
const promises_1 = require("node:fs/promises");
const path = require("node:path");
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
            code = `import '${cssFilename.replace(/\\/g, '\\\\')}';\n${code}`;
        }
        return { contents: code, loader: path.extname(args.path).slice(1) };
    };
    return {
        name: pluginName,
        setup: ((build, pipe) => {
            if (pipe?.transform) {
                return transform(pipe.transform);
            }
            build.onLoad({ filter: filter ?? /\.[cm]?[jt]sx?$/ }, async (args) => transform({ args, contents: await promises_1.readFile(args.path, 'utf8') }));
            build.onResolve({ filter: RegExp(String.raw `\.${pluginName}\.css`) }, ({ path }) => ({ path, namespace: pluginName }));
            build.onLoad({ filter: RegExp(String.raw `\.${pluginName}\.css`), namespace: pluginName }, ({ path }) => {
                const contents = cssFileContentsMap.get(path);
                return contents ? { contents, loader: 'css' } : undefined;
            });
        }),
    };
};
module.exports = plugin.default = plugin;
