"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Control = void 0;
var internal_1 = require("@tearex/internal");
function Control(subcontroller) {
    return function (controller, key, _descriptor) {
        internal_1.ApplicationContainer.getLinkInstance().registerControl(controller, key, subcontroller);
    };
}
exports.Control = Control;
