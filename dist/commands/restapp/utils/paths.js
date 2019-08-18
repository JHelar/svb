"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const fs_extra_1 = require("fs-extra");
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
        project: {
            get devSettings() {
                // Try and find the project settings path.
                let iterations = 0;
                let settingsPath = path_1.resolve(baseDirectoryPath, '..');
                const maxIterations = 10;
                while (!fs_extra_1.existsSync(settingsPath + '/.dev-settings.json')) {
                    settingsPath = path_1.resolve(settingsPath, '..');
                    iterations++;
                    if (iterations > maxIterations)
                        return undefined;
                }
                return settingsPath;
            },
            get prodSettings() {
                // Try and find the project settings path.
                let iterations = 0;
                let settingsPath = path_1.resolve(baseDirectoryPath, '..');
                const maxIterations = 10;
                while (!fs_extra_1.existsSync(settingsPath + '/.prod-settings.json')) {
                    settingsPath = path_1.resolve(settingsPath, '..');
                    iterations++;
                    if (iterations > maxIterations)
                        return undefined;
                }
                return settingsPath;
            },
        },
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
            root: baseResolver('vue/display'),
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