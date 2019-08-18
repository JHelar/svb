"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const restapp_create_1 = __importDefault(require("./restapp-create"));
const restapp_deploy_1 = __importDefault(require("./restapp-deploy"));
const command = {
    name: 'restapp',
    create: restapp_create_1.default,
    deploy: restapp_deploy_1.default
};
exports.default = command;
//# sourceMappingURL=index.js.map