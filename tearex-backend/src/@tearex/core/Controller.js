"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = void 0;
var internal_1 = require("@tearex/internal");
function Controller(constructor) {
    internal_1.ApplicationContainer.getLinkInstance().registerController(constructor);
}
exports.Controller = Controller;
