"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Intercept = void 0;
var internal_1 = require("@tearex/internal");
function Intercept() {
    var interceptorConstructors = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        interceptorConstructors[_i] = arguments[_i];
    }
    return function (controller, key, _descriptor) {
        internal_1.ApplicationContainer.getLinkInstance().registerIntercept(controller, key, interceptorConstructors);
    };
}
exports.Intercept = Intercept;
