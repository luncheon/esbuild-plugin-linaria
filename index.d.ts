import type { Options as LinariaOptions } from '@linaria/babel/types';
import type { OnLoadArgs, OnLoadResult, Plugin, PluginBuild } from 'esbuild';
interface EsbuildPipeableTransformArgs {
    readonly args: OnLoadArgs;
    readonly contents: string;
}
interface EsbuildPipeablePlugin extends Plugin {
    setup(build: PluginBuild, pipe: {
        transform: EsbuildPipeableTransformArgs;
    }): OnLoadResult;
    setup(build: PluginBuild): void;
}
interface EsbuildPluginLinariaOptions {
    readonly filter?: RegExp;
    readonly preprocess?: (code: string, args: OnLoadArgs) => string;
    readonly linariaOptions?: LinariaOptions;
}
interface EsbuildPluginLinaria {
    (options?: EsbuildPluginLinariaOptions): EsbuildPipeablePlugin;
    default: EsbuildPluginLinaria;
}
declare const _default: EsbuildPluginLinaria;
export = _default;
