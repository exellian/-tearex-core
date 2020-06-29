"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = void 0;
var internal_1 = require("@tearex/internal");
function Service(constructor) {
    internal_1.ApplicationContainer.getLinkInstance().registerService(constructor);
}
exports.Service = Service;
