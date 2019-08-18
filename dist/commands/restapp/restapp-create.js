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
const makeStructure = (baseDirectoryPath) => {
    const copyResolver = ([src, dest]) => [path_1.resolve(__dirname, '../../..', src), dest];
    const copy = [
        ['defaults/restapp', baseDirectoryPath],
    ].map(copyResolver);
    // First wait for folders to be created, then add files.
    return Promise.all(copy.map(([src, dest]) => structure_1.folder.copy(src, dest)));
};
const makeManifest = (baseDirectoryPath, options) => __awaiter(this, void 0, void 0, function* () {
    const manifest = yield promtQuestions_1.default(manifestQuestions, options, 'Webapp manifest details')
        .then(manifestOptions => {
        const manifest = Object.assign({}, manifestOptions, { version: '0.0.1', type: 'RESTApp' });
        return manifest;
    });
    return () => structure_1.file.writeFile(path_1.resolve(baseDirectoryPath, 'src/manifest.json'), JSON.stringify(manifest));
});
exports.default = (cmd, options) => __awaiter(this, void 0, void 0, function* () {
    const saveManifest = yield makeManifest(cmd.directoryPath, options);
    const tasks = [
        {
            title: 'Create folder structure',
            task: () => makeStructure(cmd.directoryPath)
        },
        {
            title: 'Save manifest.json file',
            task: () => saveManifest()
        }
    ];
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
//# sourceMappingURL=restapp-create.js.map