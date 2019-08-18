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
const structure_1 = require("../../utils/structure");
const promtQuestions_1 = __importDefault(require("../../utils/promtQuestions"));
const path_1 = require("path");
const listr_1 = __importDefault(require("listr"));
const paths_1 = __importDefault(require("./utils/paths"));
const execa_1 = __importDefault(require("execa"));
const v4_1 = __importDefault(require("uuid/v4"));
const is_windows_1 = __importDefault(require("is-windows"));
const fs_extra_1 = require("fs-extra");
// Cannot test these yet (need to figure out a way to simulate stdin?)
/* istanbul ignore next */
const manifestQuestions = [
    {
        name: 'id',
        type: 'input',
        message: 'Webapp id',
        validate: (answer) => answer && answer.trim() !== ''
    },
    {
        name: 'name',
        type: 'input',
        message: 'Webapp name (this name will be the module name!)',
        validate: (answer) => answer && answer.trim() !== ''
    },
    {
        name: 'author',
        type: 'input',
        message: 'Webapp author',
        default: 'HiQ Mälardalen',
        validate: (answer) => answer ? true : false,
    },
    {
        name: 'description',
        type: 'input',
        message: 'Description of webapp',
        default: ' ',
        validate: (answer) => answer ? true : false
    },
    {
        name: 'helpUrl',
        type: 'input',
        message: 'Help url',
        default: 'https://www.hiq.se',
        validate: (answer) => answer && answer.trim() !== ''
        // ToDo: validate the url?
    }
];
const makeStructure = (baseDirectoryPath, vue) => {
    const copyResolver = ([src, dest]) => [path_1.resolve(__dirname, '../../..', src), dest];
    const paths = paths_1.default(baseDirectoryPath);
    const createFolders = Object.values(paths.folders);
    const copy = [
        [vue ? 'defaults/webapp/vue' : 'defaults/webapp/no-vue', baseDirectoryPath],
        ['defaults/webapp/gitignore', paths.files.ignore]
    ].map(copyResolver);
    // First wait for folders to be created, then add files.
    return Promise.all(createFolders.map(path => structure_1.folder.create(path)))
        .then(() => Promise.all(copy.map(([src, dest]) => structure_1.folder.copy(src, dest))));
};
const instantiateVue = (baseDirectoryPath) => __awaiter(this, void 0, void 0, function* () {
    const paths = paths_1.default(baseDirectoryPath);
    const vueRootPath = is_windows_1.default() ? paths.vue.vue : paths.vue.root;
    // Check if @vue/cli is installed globally
    yield execa_1.default('npm', ['list', '-g', '@vue/cli'], { cwd: vueRootPath, stdout: process.stdout, stdin: process.stdin, })
        .catch(error => {
        throw new Error('@vue/cli is not installed, please run "npm i -g @vue/cli"');
    });
    return execa_1.default('vue', ['create', is_windows_1.default() ? 'display' : '.', '--preset', path_1.resolve(__dirname, '../../..', 'defaults/vue-presets'), '--no-git', '--force'], { cwd: vueRootPath })
        .then(vueCreateResult => {
        if (vueCreateResult.failed) {
            throw new Error('Could not instantiate vue');
        }
        return {
            success: true,
            message: 'Webapp with vue created!'
        };
    });
});
const setAppName = (baseDirectoryPath, appName) => __awaiter(this, void 0, void 0, function* () {
    const paths = paths_1.default(baseDirectoryPath);
    const appNameFiles = [
        `${paths.vue.src}/main.ts`,
        paths.files.main
    ];
    appNameFiles.forEach((file) => __awaiter(this, void 0, void 0, function* () {
        const exists = yield fs_extra_1.pathExists(file);
        if (exists) {
            const fileBuffer = yield fs_extra_1.readFile(file);
            const fileContents = fileBuffer.toString();
            const newFileContents = fileContents.replace(/APP_NAME/g, appName);
            yield fs_extra_1.writeFile(file, newFileContents);
        }
    }));
});
const makeManifest = (baseDirectoryPath, options) => __awaiter(this, void 0, void 0, function* () {
    const manifest = yield promtQuestions_1.default(manifestQuestions, options, 'Webapp manifest details')
        .then(manifestOptions => {
        const manifest = Object.assign({}, manifestOptions, { version: '0.0.1', type: 'WebApp' });
        return manifest;
    });
    return () => __awaiter(this, void 0, void 0, function* () {
        yield structure_1.file.writeFile(path_1.resolve(baseDirectoryPath, 'src/manifest.json'), JSON.stringify(manifest));
        return manifest;
    });
});
exports.default = (cmd, options) => __awaiter(this, void 0, void 0, function* () {
    const saveManifest = yield makeManifest(cmd.directoryPath, options);
    const tasks = [
        {
            title: 'Create folder structure',
            task: () => makeStructure(cmd.directoryPath, cmd.vue)
        },
        {
            title: 'Save manifest.json file',
            task: (ctx) => __awaiter(this, void 0, void 0, function* () {
                ctx.manifest = yield saveManifest();
            })
        }
    ];
    if (cmd.vue) {
        tasks.push({
            title: 'Setting up vue environment (this usually takes a while ~1-2min)',
            task: ctx => instantiateVue(cmd.directoryPath)
                .then(result => {
                if (result.success) {
                    return setAppName(cmd.directoryPath, v4_1.default().replace(/-/g, ''));
                }
                else {
                    throw result;
                }
            })
                .then(() => { })
        });
    }
    const list = new listr_1.default(tasks);
    return list.run()
        .then(() => ({
        success: true,
        message: `Successfully created webapp at ${cmd.directoryPath}`
    }))
        .catch((error) => {
        // ToDo: handle error
        return {
            success: false,
            message: error.message
        };
    });
});
//# sourceMappingURL=webapp-create.js.map