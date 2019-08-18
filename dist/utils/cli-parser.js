"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const path_1 = __importDefault(require("path"));
exports.default = () => {
    const myCommands = yargs_1.default
        .usage('Usage: svhiq <task> <type> [options]')
        .demandCommand(2)
        .option('force', {
        alias: 'f',
        description: 'Force deploy of a webapp',
    })
        .option('vue', {
        description: 'Create webapp with vue template'
    })
        .option('production', {
        alias: 'p',
        description: 'Deploy to production'
    })
        // .command('create webapp', 'Create a webapp')
        // .command('create project', 'Create a new project')
        // .command('deploy webapp', 'Deploy a webapp')
        .example('svhiq create webapp my-webapp', 'Create a new webapp called my-webapp in current directory')
        .example('svhiq deploy webapp', 'Deploy the webapp in current directory')
        .help('h', 'help')
        .epilog('Copyright 2019')
        .exitProcess(false);
    const _a = myCommands.parse(process.argv.slice(2)), { _, $0 } = _a, rest = __rest(_a, ["_", "$0"]);
    const [task, name, fileName] = _;
    if (task && name) {
        const directoryPath = path_1.default.resolve(process.cwd(), fileName || '.');
        return Object.assign({ command: {
                name,
                task,
            }, directoryPath }, rest);
    }
    /* istanbul ignore next */
    throw new Error('Insufficient arguments');
};
//# sourceMappingURL=cli-parser.js.map