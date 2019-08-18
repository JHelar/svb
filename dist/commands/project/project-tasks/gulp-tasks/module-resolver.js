"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gulp_1 = __importDefault(require("gulp"));
const gulp_plumber_1 = __importDefault(require("gulp-plumber"));
const task = (paths, destination, base, options) => {
    const resolver = (filePath) => {
        return gulp_1.default.src(filePath, { base })
            .pipe(gulp_plumber_1.default({
            errorHandler: options.onError
        }))
            .pipe(require('gulp-hiq-module-resolver')())
            .pipe(gulp_1.default.dest(destination));
    };
    const watch = () => {
        const watcher = gulp_1.default.watch(paths);
        watcher.on('change', resolver);
        watcher.on('error', options.onError);
    };
    const run = () => new Promise((res, rej) => {
        const gulpStream = resolver(paths);
        gulpStream.on('error', rej);
        gulpStream.on('done', res);
    });
    return {
        watch,
        run
    };
};
exports.default = task;
//# sourceMappingURL=module-resolver.js.map