"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gulp_1 = __importDefault(require("gulp"));
const gulp_plumber_1 = __importDefault(require("gulp-plumber"));
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const files = {};
const task = (paths, destination, base, options) => {
    const webdav = require('gulp-hiq-webdav');
    const handler = () => webdav({
        webdav: options.webdav,
        remote_base: options.remote_base,
        local_base: options.local_base,
        misc: {
            errorCallback: options.onError,
            successCallback: options.onSuccess,
            statusCallback: options.onStatus
        }
    });
    const webdavSync = (filePath, done) => {
        if (!done) {
            done = () => { };
        }
        return gulp_1.default
            .src(filePath, { base })
            .pipe(gulp_plumber_1.default({
            errorHandler: options.onError
        }))
            .pipe(handler().push)
            .on('data', done);
    };
    const handleFile = (filePath) => {
        if ((filePath in files && files[filePath]()) || fs_extra_1.default.statSync(filePath).isDirectory()) {
            return;
        }
        let isHandling = true;
        let spamCount = 0;
        files[filePath] = () => {
            if (spamCount > 0) {
                if (spamCount < 4) {
                    if (options.onStatus)
                        options.onStatus(`Syncing "${path_1.default.basename(filePath)}" in progress`);
                }
                else if (spamCount >= 4 && spamCount < 8) {
                    if (options.onStatus)
                        options.onStatus('Stressed much?');
                }
                else {
                    if (options.onStatus)
                        options.onStatus('STOP SPAMMING!');
                }
            }
            spamCount++;
            return isHandling;
        };
        webdavSync(filePath, () => {
            isHandling = false;
        });
    };
    const watch = () => {
        const watcher = gulp_1.default.watch(paths);
        watcher.on('change', handleFile);
        watcher.on('add', handleFile);
        watcher.on('error', options.onError);
    };
    const run = () => new Promise((res, rej) => {
        const gulpStream = webdavSync(paths);
        gulpStream.on('error', rej);
        gulpStream.on('done', res);
    });
    return {
        watch,
        run
    };
};
exports.default = task;
//# sourceMappingURL=webdav-sync.js.map