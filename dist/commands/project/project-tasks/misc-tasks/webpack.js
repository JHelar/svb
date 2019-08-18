"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const execa_1 = __importDefault(require("execa"));
const task = (paths, destination, base, options) => {
    const watch = () => {
        // Start webpack watch...
        execa_1.default('webpack', ['--config', 'webpack.config.js', '--watch'], { cwd: options.projectPath, stdout: process.stdout, stderr: process.stderr });
    };
    const run = () => new Promise((res, rej) => {
        execa_1.default('webpack', ['--config', 'webpack.config.js'], { cwd: options.projectPath, stdout: process.stdout, stderr: process.stderr })
            .then(res)
            .catch(rej);
    });
    return {
        run,
        watch
    };
};
exports.default = task;
//# sourceMappingURL=webpack.js.map