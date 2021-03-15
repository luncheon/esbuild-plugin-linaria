import type { Options as LinariaOptions } from '@linaria/babel/types';
import type { Plugin, OnLoadArgs } from 'esbuild';
interface EsbuildPluginLinariaOptions {
    readonly filter?: RegExp;
    readonly preprocess?: (code: string, args: OnLoadArgs) => string;
    readonly linariaOptions?: LinariaOptions;
}
interface EsbuildPluginLinaria {
    (options?: EsbuildPluginLinariaOptions): Plugin;
    default: EsbuildPluginLinaria;
}
declare const _default: EsbuildPluginLinaria;
export = _default;
