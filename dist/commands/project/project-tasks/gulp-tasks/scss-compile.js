"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gulp_1 = __importDefault(require("gulp"));
const gulp_plumber_1 = __importDefault(require("gulp-plumber"));
const resolve_1 = __importDefault(require("resolve"));
const path_1 = __importDefault(require("path"));
const partialResolver = (id, basedir, importOptions) => new Promise((res, rej) => {
    const resolveOptions = { extensions: ['.scss'], basedir, moduleDirectory: 'node_modules' };
    resolve_1.default(id, resolveOptions, (err, filePath) => {
        if (err) {
            // Try with '_'
            const basename = path_1.default.basename(id);
            try {
                res(resolve_1.default.sync(`${id.replace(basename, `_${basename}`)}`, resolveOptions));
            }
            catch (e) {
                rej(e);
            }
        }
        else {
            res(filePath);
        }
    });
});
const task = (paths, destination, base, options) => {
    const scss = require('gulp-sass');
    const autoprefixer = require('gulp-autoprefixer');
    const cssnano = require('gulp-cssnano');
    const rename = require('gulp-rename');
    const sassGlob = require('gulp-sass-glob');
    const scssCompile = (filePath) => {
        return gulp_1.default
            .src(filePath, { base })
            .pipe(gulp_plumber_1.default({
            errorHandler: options.onError
        }))
            .pipe(sassGlob())
            .pipe(scss({ outputStyle: 'compressed' }))
            .pipe(autoprefixer())
            .pipe(cssnano({ zindex: false, discardUnused: false }))
            .pipe(rename({
            extname: '.css'
        }))
            .pipe(gulp_1.default.dest(destination));
    };
    const watch = () => {
        const watcher = gulp_1.default.watch(paths);
        watcher.on('change', scssCompile);
        watcher.on('error', options.onError);
    };
    const run = () => new Promise((res, rej) => {
        const gulpStream = scssCompile(paths);
        gulpStream.on('error', rej);
        gulpStream.on('done', res);
    });
    return {
        watch,
        run
    };
};
exports.default = task;
//# sourceMappingURL=scss-compile.js.map