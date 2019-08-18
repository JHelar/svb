"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const webapp_create_1 = __importDefault(require("./webapp-create"));
const webapp_deploy_1 = __importDefault(require("./webapp-deploy"));
const command = {
    name: 'webapp',
    create: webapp_create_1.default,
    deploy: webapp_deploy_1.default
};
exports.default = command;
//# sourceMappingURL=index.js.map