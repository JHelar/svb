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
        globs: {
            velocity: [baseResolver('src/sv-modules/**/*.vm')],
            svModules: [baseResolver('src/sv-modules/**/*.js')],
            scss: [baseResolver('src/styles/**/*.scss'), `!${baseResolver('src/styles/**/_*.scss')}`],
            resources: [baseResolver('src/resources/**/*')],
            client: [baseResolver('src/client/**/*.js')],
            sync: [baseResolver('dist/**/*.*')]
        },
        folders: {
            src: baseResolver('src'),
            dist: baseResolver('dist'),
            client: baseResolver('src/client'),
            resources: baseResolver('src/resources'),
            styles: baseResolver('src/styles'),
            svModules: baseResolver('src/sv-modules'),
            node_modules: baseResolver('src/node_modules')
        },
        files: {
            settings: baseResolver('.dev-settings.json'),
            prodSettings: baseResolver('.prod-settings.json'),
            ignore: baseResolver('.gitignore'),
            webpackConfig: baseResolver('webpack.config.js')
        },
    };
};
//# sourceMappingURL=paths.js.map