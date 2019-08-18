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
const promtQuestions_1 = __importDefault(require("../../../utils/promtQuestions"));
const paths_1 = __importDefault(require("./paths"));
const structure_1 = require("../../../utils/structure");
/* istanbul ignore next */
const signQuestions = [
    {
        name: 'username',
        message: 'Username for developer.sitevision.se',
        validate: (answer) => answer && answer.trim() !== ''
    },
    {
        name: 'password',
        type: 'password',
        message: 'Password for developer.sitevision.se',
        validate: (answer) => answer && answer.trim() !== ''
    },
    {
        name: 'name',
        message: 'Certificate name for signing (blank for default)'
    }
];
/* istanbul ignore next */
const propertiesQuestions = [
    {
        name: 'domain',
        message: 'Domain (http://www.example.com)',
        validate: (answer) => answer && answer.trim() !== '',
        filter: (input) => input.replace(/\/$/, '')
    },
    {
        name: 'siteName',
        message: 'Site name (name on the SiteVision "house")',
        validate: (answer) => answer && answer.trim() !== ''
    },
    {
        name: 'username',
        message: 'Username for site',
        validate: (answer) => answer && answer.trim() !== ''
    },
    {
        name: 'password',
        type: 'password',
        message: 'Password for site',
        validate: (answer) => answer && answer.trim() !== ''
    },
    {
        name: 'created',
        type: 'confirm',
        message: 'Is this restapp allready created?',
        default: false
    }
];
/**
 * Generate settings object
 * @param cmd The command that spawned this
 * @param options Object maninly used for testing purposes, if undefined it will read the .app-settings.json file in the webapp directory.
 */
const restappSettings = (cmd, options) => __awaiter(this, void 0, void 0, function* () {
    const paths = paths_1.default(cmd.directoryPath);
    const isProduction = options && options.production;
    // Find app-settings file in project
    const settingsPath = options && options.production ? paths.files.prodSettings : paths.files.settings;
    const prodSettings = yield structure_1.file.readJson(paths.files.prodSettings)
        .catch(error => {
        // ToDo: Handle error!
        return undefined;
    });
    const devSettings = yield structure_1.file.readJson(paths.files.settings)
        .catch(error => {
        // ToDo: Handle error!
        return undefined;
    });
    let settings = isProduction ? prodSettings : devSettings;
    const getSignOptions = (signOptions) => __awaiter(this, void 0, void 0, function* () {
        const defaults = isProduction ? devSettings.sign : undefined;
        return promtQuestions_1.default(signQuestions, signOptions, 'Signing details, NOTE: Make sure that the certificate is allready installed on the target SiteVision environment!', defaults);
    });
    const getPropertiesOptions = (propertiesOptions) => __awaiter(this, void 0, void 0, function* () {
        let appName = propertiesOptions && propertiesOptions.addonName;
        const defaults = isProduction ? devSettings.properties : undefined;
        if (!appName) {
            // Fetch app name from manifest (If there is one...?)
            appName = yield structure_1.file.readJson(paths.files.manifest)
                .then(({ name }) => {
                return name;
            })
                .catch(error => {
                // ToDo: Handle error!
                return undefined;
            });
        }
        // This happens usually if the users didnt use restapp create...
        if (!appName)
            throw new Error('No restapp manifest.json file found!');
        return promtQuestions_1.default(propertiesQuestions, propertiesOptions, `Settings for the ${options.production ? 'production' : 'development'} environment.`, defaults)
            .then(answers => (Object.assign({}, answers, { addonName: appName })));
    });
    const sign = yield getSignOptions(settings ? settings.sign : options ? options.sign : undefined);
    const properties = yield getPropertiesOptions(settings ? settings.properties : options ? options.properties : undefined);
    if (!settings) {
        // Save new settings!
        settings = {
            sign,
            properties
        };
        structure_1.file.writeFile(settingsPath, JSON.stringify(settings));
    }
    return settings;
});
exports.default = restappSettings;
//# sourceMappingURL=settings.js.map