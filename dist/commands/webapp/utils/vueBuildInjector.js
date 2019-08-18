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
const execa_1 = __importDefault(require("execa"));
const paths_1 = __importDefault(require("./paths"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = require("path");
const jsFileOptions = {
    tag: 'SCRIPT_TAG_TO_JS_FILE',
    element: `<script src="<%= getResourceUrl('REPLACE_ME') %>"></script>`
};
const cssFileOptions = {
    tag: 'LINK_TAG_TO_CSS_FILE',
    element: `<link rel="stylesheet" src="<%= getResourceUrl('REPLACE_ME') %>">`
};
const copyFirstFileOfType = (sourceDir, destDir, endsWith) => __awaiter(this, void 0, void 0, function* () {
    const exists = yield fs_extra_1.default.pathExists(sourceDir);
    if (exists) {
        const files = yield fs_extra_1.default.readdir(sourceDir);
        const firstFile = files.find(file => file.endsWith(endsWith));
        if (firstFile) {
            const filename = path_1.basename(firstFile);
            fs_extra_1.default.copyFile(`${sourceDir}/${firstFile}`, destDir + `/${filename}`);
            return filename;
        }
    }
    return undefined;
});
const injectFilenameToTag = (filename, findTag, htmlElement, toFile) => __awaiter(this, void 0, void 0, function* () {
    const toFileBuffer = yield fs_extra_1.default.readFile(toFile);
    const toFileString = toFileBuffer.toString('utf8');
    // Split to lines
    const newToFile = toFileString.split('\n').reduce((fileString, line, index) => {
        if (line.includes(findTag)) {
            return `${fileString}\n<!--${findTag}-->${htmlElement.replace('REPLACE_ME', filename)}\n`;
        }
        else if (line) {
            return `${fileString}${line}\n`;
        }
        return fileString;
    }, '');
    // Write the new file.
    return yield fs_extra_1.default.writeFile(toFile, newToFile);
});
const buildInjector = (baseDirectoryPath) => __awaiter(this, void 0, void 0, function* () {
    const path = paths_1.default(baseDirectoryPath);
    // Check if there is a vue instance at all.
    const exists = yield fs_extra_1.default.pathExists(path.vue.root);
    if (!exists) {
        throw new Error('No vue instance found, is this a vue project?');
    }
    const build = () => {
        return execa_1.default('npm', ['run', 'build'], {
            cwd: path.vue.root
        })
            .then(buildResult => {
            if (!buildResult.failed) {
                return {
                    success: true,
                    message: 'Vue build finished'
                };
            }
            else {
                return {
                    success: false,
                    message: buildResult.stderr
                };
            }
        });
    };
    const inject = () => __awaiter(this, void 0, void 0, function* () {
        yield fs_extra_1.default.emptyDir(path.vue.resource);
        yield fs_extra_1.default.emptyDir(path.folders.css);
        const folderExsits = yield fs_extra_1.default.pathExists(path.vue.resource);
        if (!folderExsits) {
            yield fs_extra_1.default.mkdirp(path.vue.resource);
        }
        const jsFilename = yield copyFirstFileOfType(path.vue.dist.js, path.vue.resource, '.js');
        yield copyFirstFileOfType(path.vue.dist.js, path.vue.resource, '.map');
        const cssFilename = yield copyFirstFileOfType(path.vue.dist.css, path.folders.css, '.css');
        yield copyFirstFileOfType(path.vue.dist.css, path.folders.css, '.map');
        if (jsFilename) {
            yield injectFilenameToTag(`vue/${jsFilename}`, jsFileOptions.tag, jsFileOptions.element, path.files.mainHTML);
        }
        return {
            success: true,
            message: `Copied and injected js: ${jsFilename}, Copied and injected css: ${cssFilename}`
        };
    });
    return () => build().then(buildResult => {
        if (buildResult.success) {
            return inject;
        }
        throw new Error(buildResult.message);
    });
});
exports.default = buildInjector;
//# sourceMappingURL=vueBuildInjector.js.map