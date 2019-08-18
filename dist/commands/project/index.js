"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const project_create_1 = __importDefault(require("./project-create"));
const project_watch_1 = __importDefault(require("./project-watch"));
const command = {
    name: 'project',
    create: project_create_1.default,
    watch: project_watch_1.default
};
exports.default = command;
//# sourceMappingURL=index.js.map