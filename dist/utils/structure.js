"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const zip_dir_1 = __importDefault(require("zip-dir"));
exports.folder = {
    create: fs_extra_1.default.mkdirp,
    toZipBuffer: (sourcePath) => {
        return new Promise((res, rej) => {
            zip_dir_1.default(sourcePath, (err, buffer) => {
                if (err) {
                    rej(err);
                }
                else {
                    res(buffer);
                }
            });
        });
    },
    copy: fs_extra_1.default.copy
};
exports.file = {
    writeFile: fs_extra_1.default.writeFile,
    readFile: fs_extra_1.default.readFile,
    readJson: (filePath) => fs_extra_1.default.readJSON(filePath),
    copy: fs_extra_1.default.copyFile,
};
//# sourceMappingURL=structure.js.map