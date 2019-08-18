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
const query_string_1 = require("query-string");
const paths_1 = __importDefault(require("../commands/webapp/utils/paths"));
const structure_1 = require("../utils/structure");
const requestWrapper_1 = require("../utils/requestWrapper");
const v4_1 = __importDefault(require("uuid/v4"));
const signAddon = ({ baseDirectoryPath, sitevisionPassword, sitevisionUsername, certificateName }, requester) => __awaiter(this, void 0, void 0, function* () {
    const paths = paths_1.default(baseDirectoryPath);
    const zipFile = yield structure_1.folder.toZipBuffer(paths.folders.src);
    // return zipFile;
    const url = `https://developer.sitevision.se/rest-api/appsigner/signapp?${query_string_1.stringify({ certificateName })}`;
    const auth = {
        password: sitevisionPassword,
        username: sitevisionUsername
    };
    const headers = {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/zip'
    };
    const formData = {
        file: {
            value: zipFile,
            options: {
                filename: `webapp-boiler-${v4_1.default()}`,
                contentType: 'application/octet-stream'
            }
        }
    };
    return requestWrapper_1.post({
        url,
        formData,
        encoding: null,
        auth,
        headers
    }, requester);
});
exports.default = signAddon;
//# sourceMappingURL=sign-addon.js.map