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
const querystring_1 = require("querystring");
const query_string_1 = require("query-string");
const requestWrapper_1 = require("../utils/requestWrapper");
const paths_1 = __importDefault(require("../commands/webapp/utils/paths"));
const structure_1 = require("../utils/structure");
const v4_1 = __importDefault(require("uuid/v4"));
const deployAddon = ({ zipFile, domain, siteName, addonName, password, username, force, restApp }, requester) => __awaiter(this, void 0, void 0, function* () {
    if (typeof zipFile === 'string') {
        const paths = paths_1.default(zipFile);
        zipFile = yield structure_1.folder.toZipBuffer(paths.folders.src);
    }
    const url = `${domain}/rest-api/1/0/${querystring_1.escape(siteName)}/Addon Repository/${querystring_1.escape(addonName)}/${restApp ? 'restAppImport' : 'webAppImport'}?${query_string_1.stringify({
        force
    })}`;
    const auth = {
        password,
        username
    };
    const headers = {
        'Content-Type': 'multipart/form-data'
    };
    const formData = {
        file: {
            value: zipFile,
            options: {
                filename: `webapp-boiler-${v4_1.default()}.zip`
            }
        }
    };
    return requestWrapper_1.post({
        url,
        formData,
        auth,
        headers
    }, requester).then(success => {
        // ToDo: Handle and introspect success data
        return true;
    });
});
exports.default = deployAddon;
//# sourceMappingURL=deploy-addon.js.map