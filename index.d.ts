import type { Preprocessor } from '@linaria/babel/types';
import type { Plugin } from 'esbuild';
interface EsbuildLinariaOptions {
    readonly filter?: RegExp;
    readonly preprocessor?: Preprocessor;
}
interface EsbuildLinaria {
    (options?: EsbuildLinariaOptions): Plugin;
    default: EsbuildLinaria;
}
declare const _default: EsbuildLinaria;
export = _default;
