"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Put = void 0;
var _1 = require(".");
var internal_1 = require("@tearex/internal");
function Put(controller, key, _descriptor) {
    internal_1.ApplicationContainer.getLinkInstance().registerRoute(controller, key, _1.HttpMethod.PUT);
}
exports.Put = Put;
