"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const is_windows_1 = __importDefault(require("is-windows"));
exports.default = (baseDirectoryPath) => {
    const baseResolver = (path) => {
        const appendedPath = path_1.resolve(baseDirectoryPath, path);
        if (is_windows_1.default) {
            return appendedPath.replace(/\\/g, '/');
        }
        return appendedPath;
    };
    return {
        folders: {
            src: baseResolver('src'),
            component: baseResolver('src/component'),
            config: baseResolver('src/config'),
            css: baseResolver('src/css'),
            resource: baseResolver('src/resource'),
            i18n: baseResolver('src/i18n'),
            template: baseResolver('src/template'),
            partials: baseResolver('src/template/partials'),
        },
        vue: {
            vue: baseResolver('vue'),
            root: baseResolver('vue/display'),
            src: baseResolver('vue/display/src'),
            resource: baseResolver('src/resource/vue'),
            dist: {
                js: baseResolver('vue/display/dist/js'),
                css: baseResolver('vue/display/dist/css')
            }
        },
        files: {
            index: baseResolver('src/index.js'),
            main: baseResolver('src/main.js'),
            mainHTML: baseResolver('src/template/main.html'),
            manifest: baseResolver('src/manifest.json'),
            settings: baseResolver('.dev-settings.json'),
            prodSettings: baseResolver('.prod-settings.json'),
            language: {
                sv: baseResolver('src/i18n/sv.json'),
                en: baseResolver('src/i18n/en.json'),
            },
            ignore: baseResolver('.gitignore'),
        },
    };
};
//# sourceMappingURL=paths.js.map