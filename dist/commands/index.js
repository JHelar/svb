"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const webapp_1 = __importDefault(require("./webapp"));
const restapp_1 = __importDefault(require("./restapp"));
const project_1 = __importDefault(require("./project"));
const commands = {};
const registerCommand = (command) => {
    commands[command.name] = command;
};
[
    webapp_1.default,
    restapp_1.default,
    project_1.default
].forEach(registerCommand);
exports.default = commands;
//# sourceMappingURL=index.js.map