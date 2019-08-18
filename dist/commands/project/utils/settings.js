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
const propertiesQuestions = [
    {
        name: 'domain',
        message: 'Domain (http://www.example.com)',
        validate: (answer) => answer && answer.trim() !== '',
        filter: (input) => input.replace(/\/$/, '')
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
        type: 'input',
        name: 'remote_base',
        default: 'files/System',
        message: 'Remote base directory for development files'
    }
];
/**
 * Generate settings object
 * @param cmd The command that spawned this
 * @param options Object maninly used for testing purposes, if undefined it will read the .app-settings.json file in the webapp directory.
 */
const webappSettings = (cmd, options) => __awaiter(this, void 0, void 0, function* () {
    const paths = paths_1.default(cmd.directoryPath);
    // Find app-settings file in project
    const settingsPath = options.production ? paths.files.prodSettings : paths.files.settings;
    let settings = yield structure_1.file.readJson(settingsPath)
        .catch(error => {
        return undefined;
    });
    if (!settings) {
        settings = yield promtQuestions_1.default(propertiesQuestions, options.settings, 'Project settings');
        // Save new settings!
        structure_1.file.writeFile(settingsPath, JSON.stringify(settings));
    }
    return settings;
});
exports.default = webappSettings;
//# sourceMappingURL=settings.js.map