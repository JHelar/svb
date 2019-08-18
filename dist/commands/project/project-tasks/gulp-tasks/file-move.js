"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gulp_1 = __importDefault(require("gulp"));
const gulp_plumber_1 = __importDefault(require("gulp-plumber"));
const task = (paths, destination, base, options) => {
    const moveTask = (filePath) => {
        return gulp_1.default.src(filePath, { base })
            .pipe(gulp_plumber_1.default({
            errorHandler: options.onError
        }))
            .pipe(gulp_1.default.dest(destination));
    };
    const watch = () => {
        const watcher = gulp_1.default.watch(paths);
        watcher.on('change', moveTask);
        watcher.on('add', moveTask);
        watcher.on('error', options.onError);
    };
    const run = () => new Promise((res, rej) => {
        const gulpStream = moveTask(paths);
        gulpStream.on('error', rej);
        gulpStream.on('done', res);
    });
    return {
        run,
        watch
    };
};
exports.default = task;
//# sourceMappingURL=file-move.js.map