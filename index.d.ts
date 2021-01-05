import type { Preprocessor } from '@linaria/babel/types';
import type { Plugin } from 'esbuild';
interface EsbuildPluginLinariaOptions {
    readonly filter?: RegExp;
    readonly preprocessor?: Preprocessor;
}
interface EsbuildPluginLinaria {
    (options?: EsbuildPluginLinariaOptions): Plugin;
    default: EsbuildPluginLinaria;
}
declare const _default: EsbuildPluginLinaria;
export = _default;
