"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validator = void 0;
var core_1 = require("@tearex/core");
var Validator = /** @class */ (function () {
    function Validator(injector, validations) {
        var e_1, _a, e_2, _b;
        this.injector = injector;
        /**
        /* Deep copy of validatons for state independence
        */
        var copy = new Map();
        try {
            for (var _c = __values(validations.entries()), _d = _c.next(); !_d.done; _d = _c.next()) {
                var validaton = _d.value;
                var propertyValidation = new Map();
                try {
                    for (var _e = (e_2 = void 0, __values(validaton[1].entries())), _f = _e.next(); !_f.done; _f = _e.next()) {
                        var p = _f.value;
                        var arr = new Array(p[1].length);
                        for (var i = 0; i < p[1].length; i++) {
                            arr[i] = p[1][i];
                        }
                        propertyValidation.set(p[0], arr);
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                copy.set(validaton[0], propertyValidation);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_1) throw e_1.error; }
        }
        this.validations = copy;
    }
    Validator.prototype.validate = function (object, objectConstructor) {
        var e_3, _a, e_4, _b;
        if (object === null || undefined) {
            throw core_1.error(objectConstructor.name, undefined, core_1.TeapotError.VALIDATION_FAILED);
        }
        var validations = this.validations.get(objectConstructor.name);
        if (validations === undefined) {
            throw core_1.error(objectConstructor.name, undefined, core_1.TeapotError.VALIDATION_FAILED);
        }
        try {
            for (var _c = __values(validations.entries()), _d = _c.next(); !_d.done; _d = _c.next()) {
                var validaton = _d.value;
                try {
                    for (var _e = (e_4 = void 0, __values(validaton[1])), _f = _e.next(); !_f.done; _f = _e.next()) {
                        var validatorName = _f.value;
                        var validator = this.injector.getLinkInstance(validatorName);
                        if (!validator.object.validate(object[validaton[0]])) {
                            throw core_1.error(objectConstructor.name, undefined, core_1.TeapotError.VALIDATION_FAILED);
                        }
                    }
                }
                catch (e_4_1) { e_4 = { error: e_4_1 }; }
                finally {
                    try {
                        if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                    }
                    finally { if (e_4) throw e_4.error; }
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return Object.assign(new objectConstructor(), object);
    };
    return Validator;
}());
exports.Validator = Validator;
