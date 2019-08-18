"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const file_move_1 = __importDefault(require("./file-move"));
const module_resolver_1 = __importDefault(require("./module-resolver"));
const webpack_1 = __importDefault(require("./webpack"));
const scss_compile_1 = __importDefault(require("./scss-compile"));
const webdav_sync_1 = __importDefault(require("./webdav-sync"));
exports.default = {
    move: file_move_1.default,
    nodeResolver: module_resolver_1.default,
    webpack: webpack_1.default,
    scss: scss_compile_1.default,
    webdav: webdav_sync_1.default
};
//# sourceMappingURL=index.js.map