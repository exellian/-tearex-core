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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Injector = void 0;
require("reflect-metadata");
var core_1 = require("@tearex/core");
var Injector = /** @class */ (function () {
    function Injector() {
        this.injectableConstructors = new Map();
        this.injectables = new Map();
    }
    /**
    * Registers a class as unsealed. This means that the instance of the class can be injected to other injectables.
    * @param constructor must be a valid class
    */
    Injector.prototype.register = function (constructor) {
        this.registerInjectable(constructor, false);
    };
    /**
    * Registers a class as sealed. This means that the instance of the class can not be injected to other injectables.
    * This means that the instance should only be used directly. For example: Controllers are sealed because they should
    * not be injected to Services or Interceptors
    * @param constructor must be a valid class
    */
    Injector.prototype.registerSealed = function (constructor) {
        this.registerInjectable(constructor, true);
    };
    /**
    * @param name must be a valid class name where the class is registered either as sealed or unsealed
    */
    Injector.prototype.getLinkInstance = function (name) {
        return this.getLinkInstanceHelper(name, false, []);
    };
    /**
    * @param name must be a valid class name where the class is registered either as sealed or unsealed
    * @param cache must be a object that should be stored in relation to the specified class name instance
    */
    Injector.prototype.setCache = function (name, cache) {
        var injectable = this.injectables.get(name);
        if (injectable !== undefined) {
            injectable.cache = cache;
        }
    };
    Injector.prototype.registerInjectable = function (constructor, sealed) {
        if (this.injectableConstructors.has(constructor.name)) {
            throw core_1.error(constructor.name, undefined, core_1.TeapotError.DUPLICATE_INJECTABLE, true);
        }
        this.injectableConstructors.set(constructor.name, {
            dependencies: undefined,
            constructor: constructor,
            sealed: sealed
        });
    };
    Injector.prototype.getLinkInstanceHelper = function (name, recursive, dependent) {
        var e_1, _a, e_2, _b, _c;
        var injectable = this.injectables.get(name);
        if (injectable === undefined) {
            var metadata = this.injectableConstructors.get(name);
            if (metadata === undefined) {
                throw core_1.error(name, undefined, core_1.TeapotError.INJECTABLE_NOT_FOUND, true);
            }
            if (metadata.dependencies === undefined) {
                metadata.dependencies = Injector.getTypeNames(metadata.constructor);
            }
            var params = [];
            dependent.push(name);
            try {
                for (var _d = __values(metadata.dependencies), _e = _d.next(); !_e.done; _e = _d.next()) {
                    var typeName = _e.value;
                    try {
                        for (var dependent_1 = (e_2 = void 0, __values(dependent)), dependent_1_1 = dependent_1.next(); !dependent_1_1.done; dependent_1_1 = dependent_1.next()) {
                            var item = dependent_1_1.value;
                            if (item === typeName) {
                                throw core_1.error(name, undefined, core_1.TeapotError.CIRCULAR_DEPENDENCY_INJECTION, true);
                            }
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (dependent_1_1 && !dependent_1_1.done && (_b = dependent_1.return)) _b.call(dependent_1);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                    params.push(this.getLinkInstanceHelper(typeName, true, dependent).object);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
                }
                finally { if (e_1) throw e_1.error; }
            }
            if (metadata.sealed && recursive) {
                throw core_1.error(name, undefined, core_1.TeapotError.SEALED_DEPENDENCY_INJECTION, true);
            }
            injectable = {
                object: new ((_c = metadata.constructor).bind.apply(_c, __spread([void 0], params)))(),
                cache: undefined
            };
            this.injectables.set(name, injectable);
        }
        return injectable;
    };
    Injector.getTypeNames = function (constructor) {
        var types = Reflect.getMetadata("design:paramtypes", constructor);
        var typeNames = [];
        if (types === undefined) {
            return typeNames;
        }
        for (var i = 0; i < types.length; i++) {
            var t = types[i]();
            if (Injector.checkPrimitiveType(t.name)) {
                throw core_1.error(constructor.name, undefined, core_1.TeapotError.PRIMITIVE_DEPENDENCY_INJECTION, true);
            }
            if (Injector.checkApplicationType(t.name)) {
                throw core_1.error(constructor.name, undefined, core_1.TeapotError.FRAMEWORK_DEPENDENCY_INJECTION, true);
            }
            typeNames.push(t.name);
        }
        return typeNames;
    };
    Injector.checkPrimitiveType = function (name) {
        return name === "String" || name === "Boolean" || name === "Number" || name === "Function" || name === "Object";
    };
    Injector.checkApplicationType = function (name) {
        return name === "Client" || name === "HttpHeaders";
    };
    return Injector;
}());
exports.Injector = Injector;
