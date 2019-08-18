"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const listr_1 = __importDefault(require("listr"));
const project_tasks_1 = __importDefault(require("./project-tasks"));
const console_1 = __importDefault(require("../../utils/console"));
const paths_1 = __importDefault(require("./utils/paths"));
const settings_1 = __importDefault(require("./utils/settings"));
const console = console_1.default('PROJECT-WATCH');
const onError = (err) => {
    // const error = {
    // 	...err
    // }
    console.error(JSON.stringify(err));
};
exports.default = (cmd) => __awaiter(this, void 0, void 0, function* () {
    if (cmd.production) {
        process.env.NODE_ENV = 'production';
    }
    else {
        process.env.NODE_ENV = 'development';
    }
    const paths = paths_1.default(cmd.directoryPath);
    const settings = yield settings_1.default(cmd, { production: cmd.production });
    let webdavUrl = settings.domain;
    if (!webdavUrl.endsWith('webdav')) {
        webdavUrl = webdavUrl.replace(/\/$/, '') + '/webdav';
    }
    const list = new listr_1.default([
        {
            title: 'Starting velocity compiler',
            task: () => project_tasks_1.default
                .move(paths.globs.velocity, paths.folders.dist, paths.folders.src, {
                onError
            })
                .watch()
        },
        {
            title: 'Starting resource mover',
            task: () => project_tasks_1.default
                .move(paths.globs.resources, paths.folders.dist, paths.folders.src, {
                onError
            })
                .watch()
        },
        {
            title: 'Starting sv module resolver',
            task: () => project_tasks_1.default
                .nodeResolver(paths.globs.svModules, paths.folders.dist, paths.folders.src, { onError })
                .watch()
        },
        {
            title: 'Starting scss compiler',
            task: () => project_tasks_1.default
                .scss(paths.globs.scss, paths.folders.dist, paths.folders.src, {
                onError,
                node_modules_path: paths.folders.node_modules
            })
                .watch()
        },
        {
            title: 'Starting webpack watcher',
            task: () => project_tasks_1.default
                .webpack(paths.globs.client, paths.folders.dist, paths.folders.src, {
                onError,
                projectPath: cmd.directoryPath
            })
                .watch()
        },
        {
            title: 'Starting remote sync',
            task: () => project_tasks_1.default
                .webdav(paths.globs.sync, '', '', {
                onError,
                onSuccess: console.success,
                onStatus: msg => console.info(msg.replace('...', '')),
                webdav: {
                    baseurl: webdavUrl,
                    password: settings.password,
                    username: settings.username
                },
                remote_base: settings.remote_base,
                local_base: 'dist'
            })
                .watch()
        }
    ]);
    return list
        .run()
        .then(() => ({
        message: 'Successfully started watchers',
        success: true
    }))
        .catch(err => ({
        success: false,
        message: err.message
    }));
});
//# sourceMappingURL=project-watch.js.map