#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cli_parser_1 = __importDefault(require("./utils/cli-parser"));
const commander_1 = __importDefault(require("./commander"));
const console_1 = __importDefault(require("./utils/console"));
const console = console_1.default('SVHIQ');
console.clear();
console.time('Task took');
try {
    const cmd = cli_parser_1.default();
    const exec = commander_1.default(cmd.command);
    console.info(`${cmd.command.name} ${cmd.command.task}`);
    // Run command
    exec(cmd)
        .then(status => {
        if (status.success) {
            console.success(status.message || 'Good stuff!');
        }
        else {
            console.error(status.message || 'Uh ooh!');
        }
    })
        .finally(() => {
        console.endTime('Task took');
    });
}
catch (e) {
    // console.error(e.message || 'Uh ooh!');
    process.exit(-1);
}
// Done
//# sourceMappingURL=index.js.map