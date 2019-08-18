"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer_1 = require("inquirer");
const console_1 = __importDefault(require("./console"));
const console = console_1.default('SVHIQ');
exports.default = (questions, options, title, defaults) => {
    if (options) {
        // Filter out questions that are allready set in options.
        Object.keys(options).forEach(key => {
            questions = questions.filter(q => q.name !== key);
        });
    }
    else {
        /* istanbul ignore next */
        options = {};
    }
    if (questions.length && title) {
        console.info(title);
        console.info('Default values in between (), press enter to use default value.');
    }
    if (defaults) {
        // Set defaults
        Object.keys(defaults).forEach(key => {
            const qIndex = questions.findIndex(q => q.name === key);
            if (qIndex > -1) {
                questions[qIndex].default = defaults[key];
            }
        });
    }
    return inquirer_1.prompt(questions)
        .then((answers) => {
        return Object.assign({}, options, answers);
    });
};
//# sourceMappingURL=promtQuestions.js.map