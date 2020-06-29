"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Required = void 0;
var internal_1 = require("@tearex/internal");
var _1 = require(".");
function Required(message, key) {
    var RequiredValidator = /** @class */ (function () {
        function RequiredValidator() {
        }
        RequiredValidator.prototype.validate = function (value) {
            return value !== undefined && value !== null;
        };
        RequiredValidator = __decorate([
            _1.Validator
        ], RequiredValidator);
        return RequiredValidator;
    }());
    internal_1.ApplicationContainer.getLinkInstance().registerValidaton(message, key, RequiredValidator);
}
exports.Required = Required;
