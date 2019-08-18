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
const api_1 = __importDefault(require("../../api"));
const paths_1 = __importDefault(require("./utils/paths"));
const structure_1 = require("../../utils/structure");
const settings_1 = __importDefault(require("./utils/settings"));
const listr_1 = __importDefault(require("listr"));
const deploy = (cmd, api = api_1.default) => __awaiter(this, void 0, void 0, function* () {
    // Check if addon is created
    const paths = paths_1.default(cmd.directoryPath);
    // Calling this guarantees us that we get the settings!
    const settings = yield settings_1.default(cmd, { production: cmd.production });
    const tasks = new listr_1.default([
        {
            title: 'Creating addon on target',
            skip: () => {
                if (settings.properties.created) {
                    return 'Addon allready created on target';
                }
            },
            task: () => api.addon.create({
                addonName: settings.properties.addonName,
                domain: settings.properties.domain,
                password: settings.properties.password,
                siteName: settings.properties.siteName,
                username: settings.properties.username,
                restApp: true
            }).then(created => {
                if (created) {
                    settings.properties.created = true;
                    return structure_1.file.writeFile(paths.files.settings, JSON.stringify(settings));
                }
                else {
                    throw new Error('Could not create settings!');
                }
            })
                .catch(() => {
                throw new Error(`Could not create addon to target, make sure the details in ${paths.files.settings} are correct!`);
            })
                .then(() => {
                return 'Addon created!';
            })
        },
    ]);
    tasks.add([
        {
            title: 'Signing addon',
            task: ctx => api.addon.sign({
                appId: settings.properties.addonName,
                baseDirectoryPath: cmd.directoryPath,
                certificateName: settings.sign.name,
                sitevisionPassword: settings.sign.password,
                sitevisionUsername: settings.sign.username,
            }).then(zipFile => {
                if (zipFile) {
                    ctx.zipFile = zipFile;
                    return 'Signed!';
                }
                else {
                    throw new Error('Could not deploy!');
                }
            })
        },
        {
            title: 'Deploying addon to target',
            task: ctx => api.addon.deploy({
                domain: settings.properties.domain,
                password: settings.properties.password,
                siteName: settings.properties.siteName,
                username: settings.properties.username,
                addonName: settings.properties.addonName,
                zipFile: ctx.zipFile,
                force: cmd.force,
                restApp: true
            }).then(success => {
                if (success) {
                    return 'Deployed!';
                }
                else {
                    throw new Error('Could not deploy!');
                }
            })
        }
    ]);
    // Create addon
    return yield tasks.run()
        .then(() => {
        return {
            success: true,
            message: `Successfully deployed RESTApp!`
        };
    })
        .catch(error => {
        // ToDo: handle error
        return {
            success: false,
            message: error.message
        };
    });
});
exports.default = deploy;
//# sourceMappingURL=restapp-deploy.js.map