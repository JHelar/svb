"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const create_addon_1 = __importDefault(require("./create-addon"));
const deploy_addon_1 = __importDefault(require("./deploy-addon"));
const sign_addon_1 = __importDefault(require("./sign-addon"));
const api = {
    addon: {
        create: create_addon_1.default,
        deploy: deploy_addon_1.default,
        sign: sign_addon_1.default
    }
};
exports.default = api;
//# sourceMappingURL=index.js.map