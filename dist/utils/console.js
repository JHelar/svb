"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("colors");
const makeLevels = (tag) => {
    return {
        log(message, ...args) {
            console.log.apply(this, [`${tag.bgGreen.white} ${message}`, ...args]);
        },
        info(message, ...args) {
            console.info.apply(this, [`${tag.inverse.yellow} ${message}`, ...args]);
        },
        error(message, ...args) {
            console.error.apply(this, [`${tag.bgRed.black} ${message.white}`, ...args]);
        },
        time(name) {
            console.time(`${tag.inverse.white} ${name}`);
        },
        endTime(name) {
            console.timeEnd(`${tag.inverse.white} ${name}`);
        },
        success(message, ...args) {
            console.log.apply(this, [`${tag.bgGreen.black} ${message.green}`]);
        },
        clear: console.clear
    };
};
exports.default = (tag) => {
    const levels = makeLevels(tag);
    return levels;
};
//# sourceMappingURL=console.js.map