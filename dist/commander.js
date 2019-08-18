"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commands_1 = __importDefault(require("./commands"));
const getExecuter = (cmd) => {
    if (cmd.name in commands_1.default) {
        const command = commands_1.default[cmd.name];
        switch (cmd.task) {
            case 'create':
                return command.create;
            case 'watch':
                return command.watch;
            case 'deploy':
                return command.deploy;
            default:
                throw new Error(`Unknown task: "${cmd.task}"`);
        }
    }
    throw new Error(`Unknown command: "${cmd.name}"`);
};
exports.default = (command) => {
    const exec = getExecuter(command);
    if (exec) {
        return exec;
    }
};
//# sourceMappingURL=commander.js.map