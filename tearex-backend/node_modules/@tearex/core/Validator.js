"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validator = void 0;
var internal_1 = require("@tearex/internal");
function Validator(validatorConstructor) {
    internal_1.ApplicationContainer.getLinkInstance().registerValidator(validatorConstructor);
}
exports.Validator = Validator;
