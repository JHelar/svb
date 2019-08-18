"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const querystring_1 = require("querystring");
const requestWrapper_1 = require("../utils/requestWrapper");
const createAddon = ({ username, domain, password, siteName, addonName, category, restApp }, requester) => {
    const url = `${domain}/rest-api/1/0/${querystring_1.escape(siteName)}/Addon Repository/${restApp ? 'headlesscustommodule' : 'custommodule'}`;
    const data = {
        name: addonName,
        category
    };
    const auth = {
        password,
        username
    };
    return requestWrapper_1.post({
        url: url,
        auth,
        form: data
    }, requester)
        .then(success => {
        // ToDo: introspect success data and return proper
        return true;
    });
};
exports.default = createAddon;
//# sourceMappingURL=create-addon.js.map