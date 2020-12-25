import type { Preprocessor } from '@linaria/babel/types';
import type { Plugin } from 'esbuild';
interface EsbuildLinariaPluginOptions {
    readonly filter?: RegExp;
    readonly preprocessor?: Preprocessor;
}
interface EsbuildLinariaPlugin {
    (options?: EsbuildLinariaPluginOptions): Plugin;
    default: EsbuildLinariaPlugin;
}
declare const _default: EsbuildLinariaPlugin;
export = _default;
