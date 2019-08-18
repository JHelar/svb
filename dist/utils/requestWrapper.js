"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = __importDefault(require("request"));
const tryParseJson = (jsonString) => {
    try {
        const json = JSON.parse(jsonString);
        return json;
    }
    catch (e) {
        return undefined;
    }
};
const makeRequestError = (error, httpResponse) => {
    const statusCode = httpResponse.statusCode || 500;
    const statusMessage = httpResponse.statusMessage || 'Ooops something went really wrong!';
    if (error instanceof Error) {
        return {
            message: error.message,
            statusCode
        };
    }
    else if (typeof error === 'string') {
        return {
            message: error,
            statusCode
        };
    }
    else {
        return Object.assign({}, error, { message: statusMessage, statusCode });
    }
};
const makeRequestCallback = (res, rej) => (error, httpResponse, body) => {
    if (error) {
        rej(makeRequestError(error, httpResponse));
    }
    else if (httpResponse.statusCode === 200) {
        // Try parse else return body
        const json = tryParseJson(body);
        res(json || body);
    }
    else {
        // Other type of status error from server try parse JSON else rej body as is.
        const json = tryParseJson(body);
        if (json) {
            rej(makeRequestError(body, httpResponse));
        }
        else {
            rej(makeRequestError({}, httpResponse));
        }
    }
};
exports.post = (args, requester = request_1.default) => {
    return new Promise((res, rej) => {
        requester.post(args, makeRequestCallback(res, rej));
    });
};
//# sourceMappingURL=requestWrapper.js.map