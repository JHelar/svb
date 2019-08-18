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
const path_1 = require("path");
const listr_1 = __importDefault(require("listr"));
const execa_1 = __importDefault(require("execa"));
const structure_1 = require("../../utils/structure");
const makeStructure = ({ directoryPath }) => {
    const copyResolver = ([src, dest]) => [
        path_1.resolve(__dirname, '../../..', src),
        dest
    ];
    const copy = [['defaults/project', directoryPath]].map(copyResolver);
    return Promise.all(copy.map(([src, dest]) => structure_1.folder.copy(src, dest)));
};
const installDependencies = ({ directoryPath }) => {
    return execa_1.default('npm', [
        'i',
        '-D',
        'webpack',
        'uglifyjs-webpack-plugin',
        'vue-loader',
        'webpack-cli',
        'babel-loader',
        'babel-loader',
        '@babel/core',
        '@babel/preset-env',
        'style-loader',
        'css-loader',
        'vue'
    ], { cwd: directoryPath, stderr: process.stderr }).then(result => {
        if (result.failed)
            throw new Error('Could not install dependencies');
        return true;
    });
};
exports.default = (cmd) => __awaiter(this, void 0, void 0, function* () {
    const list = new listr_1.default([
        {
            title: 'Creating folder structure',
            task: () => makeStructure(cmd)
        },
        {
            title: 'Installing project dependencies',
            task: () => installDependencies(cmd)
        }
    ]);
    return list
        .run()
        .then(() => ({
        success: true,
        message: `Successfully created project at ${cmd.directoryPath}`
    }))
        .catch((error) => {
        // ToDo: handle error
        return {
            success: false,
            message: error.message
        };
    });
});
//# sourceMappingURL=project-create.js.map