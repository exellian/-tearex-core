"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Intercepter = void 0;
var internal_1 = require("@tearex/internal");
function Intercepter(interceptorConstructor) {
    internal_1.ApplicationContainer.getLinkInstance().registerInterceptor(interceptorConstructor);
}
exports.Intercepter = Intercepter;
