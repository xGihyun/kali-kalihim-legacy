import * as wasm from "./my_package_bg.wasm";
import { __wbg_set_wasm } from "./my_package_bg.js";
__wbg_set_wasm(wasm);
export * from "./my_package_bg.js";
