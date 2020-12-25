var __create = Object.create;
var __defProp = Object.defineProperty;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __commonJS = (callback, module2) => () => {
  if (!module2) {
    module2 = {exports: {}};
    callback(module2.exports, module2);
  }
  return module2.exports;
};
var __exportStar = (target, module2, desc) => {
  __markAsModule(target);
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, {get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable});
  }
  return target;
};
var __toModule = (module2) => {
  if (module2 && module2.__esModule)
    return module2;
  return __exportStar(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", {value: module2, enumerable: true}), module2);
};

// node_modules/uuid/dist/rng.js
var require_rng = __commonJS((exports2) => {
  "use strict";
  Object.defineProperty(exports2, "__esModule", {
    value: true
  });
  exports2.default = rng;
  var _crypto = _interopRequireDefault(require("crypto"));
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {default: obj};
  }
  var rnds8Pool = new Uint8Array(256);
  var poolPtr = rnds8Pool.length;
  function rng() {
    if (poolPtr > rnds8Pool.length - 16) {
      _crypto.default.randomFillSync(rnds8Pool);
      poolPtr = 0;
    }
    return rnds8Pool.slice(poolPtr, poolPtr += 16);
  }
});

// node_modules/uuid/dist/regex.js
var require_regex = __commonJS((exports2) => {
  "use strict";
  Object.defineProperty(exports2, "__esModule", {
    value: true
  });
  exports2.default = void 0;
  var _default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
  exports2.default = _default;
});

// node_modules/uuid/dist/validate.js
var require_validate = __commonJS((exports2) => {
  "use strict";
  Object.defineProperty(exports2, "__esModule", {
    value: true
  });
  exports2.default = void 0;
  var _regex = _interopRequireDefault(require_regex());
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {default: obj};
  }
  function validate(uuid2) {
    return typeof uuid2 === "string" && _regex.default.test(uuid2);
  }
  var _default = validate;
  exports2.default = _default;
});

// node_modules/uuid/dist/stringify.js
var require_stringify = __commonJS((exports2) => {
  "use strict";
  Object.defineProperty(exports2, "__esModule", {
    value: true
  });
  exports2.default = void 0;
  var _validate = _interopRequireDefault(require_validate());
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {default: obj};
  }
  var byteToHex = [];
  for (let i = 0; i < 256; ++i) {
    byteToHex.push((i + 256).toString(16).substr(1));
  }
  function stringify(arr, offset = 0) {
    const uuid2 = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
    if (!(0, _validate.default)(uuid2)) {
      throw TypeError("Stringified UUID is invalid");
    }
    return uuid2;
  }
  var _default = stringify;
  exports2.default = _default;
});

// node_modules/uuid/dist/v4.js
var require_v4 = __commonJS((exports2) => {
  "use strict";
  Object.defineProperty(exports2, "__esModule", {
    value: true
  });
  exports2.default = void 0;
  var _rng = _interopRequireDefault(require_rng());
  var _stringify = _interopRequireDefault(require_stringify());
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {default: obj};
  }
  function v42(options, buf, offset) {
    options = options || {};
    const rnds = options.random || (options.rng || _rng.default)();
    rnds[6] = rnds[6] & 15 | 64;
    rnds[8] = rnds[8] & 63 | 128;
    if (buf) {
      offset = offset || 0;
      for (let i = 0; i < 16; ++i) {
        buf[offset + i] = rnds[i];
      }
      return buf;
    }
    return (0, _stringify.default)(rnds);
  }
  var _default = v42;
  exports2.default = _default;
});

// src/index.ts
var babel = __toModule(require("@linaria/babel"));
var fs = __toModule(require("fs"));
var path = __toModule(require("path"));
var v4 = __toModule(require_v4());
var name = "esbuild-plugin-linaria";
var plugin = ({filter, preprocessor} = {}) => ({
  name,
  setup(build) {
    const cssFileContentsMap = new Map();
    build.onLoad({filter: filter ?? /\.[jt]sx?$/}, async ({path: filename}) => {
      const sourceCode = await fs.promises.readFile(filename, "utf8");
      let {cssText, code} = babel.transform(sourceCode, {filename, preprocessor});
      if (cssText) {
        const cssFilename = `${v4.default()}.${name}.css`;
        cssFileContentsMap.set(cssFilename, cssText);
        code = `import '${cssFilename}'
${code}`;
      }
      return {
        contents: code,
        loader: path.extname(filename).slice(1)
      };
    });
    build.onResolve({filter: RegExp(String.raw`\.${name}\.css`)}, ({path: path2}) => ({path: path2, namespace: name}));
    build.onLoad({filter: RegExp(String.raw`\.${name}\.css`), namespace: name}, ({path: path2}) => {
      const contents = cssFileContentsMap.get(path2);
      return contents ? {contents, loader: "css"} : void 0;
    });
  }
});
module.exports = plugin.default = plugin;
