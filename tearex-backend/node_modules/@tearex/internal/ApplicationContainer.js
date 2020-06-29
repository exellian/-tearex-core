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
exports.ApplicationContainer = void 0;
var core_1 = require("@tearex/core");
var DefaultApplicationMethodMetadata = /** @class */ (function () {
    function DefaultApplicationMethodMetadata(controller) {
        this.controller = controller;
        this.methods = new Map();
    }
    DefaultApplicationMethodMetadata.prototype.getObject = function () {
        return this.controller;
    };
    DefaultApplicationMethodMetadata.prototype.getMethods = function () {
        return this.methods;
    };
    return DefaultApplicationMethodMetadata;
}());
/**
* Registers all functions and classes that are annotated
*/
var ApplicationContainer = /** @class */ (function () {
    function ApplicationContainer() {
        this.controllers = new Map();
        this.services = new Map();
        this.interceptors = new Map();
        this.validators = new Map();
        this.routes = new Map();
        this.intercepts = new Map();
        this.controls = new Map();
        this.validations = new Map();
    }
    ApplicationContainer.getLinkInstance = function () {
        if (ApplicationContainer.unqiue === null) {
            ApplicationContainer.unqiue = new ApplicationContainer();
        }
        return ApplicationContainer.unqiue;
    };
    /**
    * Registers a controllers
    * @param constructor must be a valid controller constructor
    */
    ApplicationContainer.prototype.registerController = function (constructor) {
        if (this.services.has(constructor.name)) {
            throw core_1.error(constructor.name, undefined, core_1.TeapotError.CONTROLLER_SERVICE_CONFLICT);
        }
        if (this.interceptors.has(constructor.name)) {
            throw core_1.error(constructor.name, undefined, core_1.TeapotError.CONTROLLER_INTERCEPTOR_CONFLICT);
        }
        if (this.controllers.has(constructor.name)) {
            throw core_1.error(constructor.name, undefined, core_1.TeapotError.DUPLICATE_CONTROLLER);
        }
        this.controllers.set(constructor.name, constructor);
    };
    /**
    * Registers a Service
    * @param constructor must be a valid service constructor
    */
    ApplicationContainer.prototype.registerService = function (constructor) {
        if (this.controllers.has(constructor.name)) {
            throw core_1.error(constructor.name, undefined, core_1.TeapotError.SERVICE_CONTROLLER_CONFLICT);
        }
        if (this.interceptors.has(constructor.name)) {
            throw core_1.error(constructor.name, undefined, core_1.TeapotError.SERVICE_INTERCEPTOR_CONFLICT);
        }
        if (this.services.has(constructor.name)) {
            throw core_1.error(constructor.name, undefined, core_1.TeapotError.DUPLICATE_SERVICE);
        }
        this.services.set(constructor.name, constructor);
    };
    /**
    * Registers a Interceptor
    * @param constructor must be a valid interceptor constructor
    */
    ApplicationContainer.prototype.registerInterceptor = function (constructor) {
        if (this.controllers.has(constructor.name)) {
            throw core_1.error(constructor.name, undefined, core_1.TeapotError.INTERCEPTOR_CONTROLLER_CONFLICT);
        }
        if (this.services.has(constructor.name)) {
            throw core_1.error(constructor.name, undefined, core_1.TeapotError.INTERCEPTOR_SERVICE_CONFLICT);
        }
        if (this.interceptors.has(constructor.name)) {
            throw core_1.error(constructor.name, undefined, core_1.TeapotError.DUPLICATE_INTERCEPTOR);
        }
        this.interceptors.set(constructor.name, constructor);
    };
    /**
    * Registers a Validator
    * @param constructor must be a valid validator constructor
    */
    ApplicationContainer.prototype.registerValidator = function (constructor) {
        if (this.validators.has(constructor.name)) {
            throw core_1.error(constructor.name, undefined, core_1.TeapotError.DUPLICATE_VALIDATOR);
        }
        this.validators.set(constructor.name, constructor);
    };
    /**
    * Registers a route method
    * @param controller must be a valid controller class objects
    * @param methodName must be a valid method in the controller class object
    * @param httpMethod must be the Http method for this route
    */
    ApplicationContainer.prototype.registerRoute = function (controller, methodName, httpMethod) {
        var e_1, _a;
        var metadataControls = this.controls.get(controller.constructor.name);
        if (metadataControls !== undefined) {
            if (metadataControls.methods.has(methodName)) {
                throw core_1.error(controller.constructor.name, methodName, core_1.TeapotError.CONTROL_METHOD_ROUTE);
            }
        }
        var metadata = this.routes.get(controller.constructor.name);
        if (metadata === undefined) {
            metadata = new DefaultApplicationMethodMetadata(controller);
            this.routes.set(controller.constructor.name, metadata);
        }
        var httpMethods = metadata.methods.get(methodName);
        if (httpMethods === undefined) {
            httpMethods = [];
            metadata.methods.set(methodName, httpMethods);
        }
        try {
            for (var httpMethods_1 = __values(httpMethods), httpMethods_1_1 = httpMethods_1.next(); !httpMethods_1_1.done; httpMethods_1_1 = httpMethods_1.next()) {
                var m = httpMethods_1_1.value;
                if (m === httpMethod) {
                    throw core_1.error(controller.constructor.name, methodName, core_1.TeapotError.DUPLICATE_METHOD_ROUTE);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (httpMethods_1_1 && !httpMethods_1_1.done && (_a = httpMethods_1.return)) _a.call(httpMethods_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        httpMethods.push(httpMethod);
    };
    /**
    * Registers a intercept for a route or control method
    * @param controller must be a valid controller class objects
    * @param methodName must be a valid method in the controller class object
    * @param interceptor must be a valid interceptor class
    */
    ApplicationContainer.prototype.registerIntercept = function (controller, methodName, interceptorConstructors) {
        var e_2, _a;
        var metadata = this.intercepts.get(controller.constructor.name);
        if (metadata === undefined) {
            metadata = new DefaultApplicationMethodMetadata(controller);
            this.intercepts.set(controller.constructor.name, metadata);
        }
        var interceptors = metadata.methods.get(methodName);
        if (interceptors !== undefined) {
            throw core_1.error(controller.constructor.name, methodName, core_1.TeapotError.DUPLICATE_METHOD_INTERCEPT);
        }
        interceptors = [];
        metadata.methods.set(methodName, interceptors);
        try {
            //TODO do this checking after registering
            /*for (let i = 0;i < interceptorConstructors.length;i++) {
                for (let j = 0;j < interceptorConstructors.length;j++) {
                    if (i === j) {
                        continue;
                    }
    
                    if (interceptorConstructors[i].name === interceptorConstructors[j].name) {
                        throw error(controller.constructor.name, methodName, TeapotError.DUPLICATE_METHOD_INTERCEPTOR);
                    }
                }
            }*/
            for (var interceptorConstructors_1 = __values(interceptorConstructors), interceptorConstructors_1_1 = interceptorConstructors_1.next(); !interceptorConstructors_1_1.done; interceptorConstructors_1_1 = interceptorConstructors_1.next()) {
                var interceptorConstructor = interceptorConstructors_1_1.value;
                interceptors.push(interceptorConstructor);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (interceptorConstructors_1_1 && !interceptorConstructors_1_1.done && (_a = interceptorConstructors_1.return)) _a.call(interceptorConstructors_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
    };
    /**
    * Registers a intercept for a route or control method
    * @param controller must be a valid controller class objects
    * @param methodName must be a valid method in the controller class object
    * @param subcontroller must be a valid controller class producer
    */
    ApplicationContainer.prototype.registerControl = function (controller, methodName, subcontroller) {
        var metadataRoutes = this.routes.get(controller.constructor.name);
        if (metadataRoutes !== undefined) {
            if (metadataRoutes.methods.has(methodName)) {
                throw core_1.error(controller.constructor.name, methodName, core_1.TeapotError.ROUTE_METHOD_CONTROL);
            }
        }
        var metadata = this.controls.get(controller.constructor.name);
        if (metadata === undefined) {
            metadata = new DefaultApplicationMethodMetadata(controller);
            this.controls.set(controller.constructor.name, metadata);
        }
        if (metadata.methods.has(methodName)) {
            throw core_1.error(controller.constructor.name, methodName, core_1.TeapotError.DUPLICATE_METHOD_CONTROL);
        }
        metadata.methods.set(methodName, subcontroller);
    };
    /**
    * Registers a validation for any message class of a given property
    * @param message must be a object of a class with empty constructor
    * @param propertyName must be a valid property in the message class
    * @param validator must be a valid class of a registered Validator
    */
    ApplicationContainer.prototype.registerValidaton = function (message, propertyName, validator) {
        var e_3, _a;
        var validationProperties = this.validations.get(message.constructor.name);
        if (validationProperties === undefined) {
            validationProperties = new Map();
            this.validations.set(message.constructor.name, validationProperties);
        }
        var validations = validationProperties.get(propertyName);
        if (validations === undefined) {
            validations = [];
            validationProperties.set(propertyName, validations);
        }
        try {
            for (var validations_1 = __values(validations), validations_1_1 = validations_1.next(); !validations_1_1.done; validations_1_1 = validations_1.next()) {
                var v = validations_1_1.value;
                if (v === validator.name) {
                    throw core_1.error(message.constructor.name, propertyName, core_1.TeapotError.DUPLICATE_PROPERTY_VALIDATOR);
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (validations_1_1 && !validations_1_1.done && (_a = validations_1.return)) _a.call(validations_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
        validations.push(validator.name);
    };
    /**
    * @return returns all registered controllers
    */
    ApplicationContainer.prototype.getControllers = function () {
        return this.controllers;
    };
    /**
    * @return returns all registered services
    */
    ApplicationContainer.prototype.getServices = function () {
        return this.services;
    };
    /**
    * @return returns all registered interceptors
    */
    ApplicationContainer.prototype.getInterceptors = function () {
        return this.interceptors;
    };
    /**
    * @return returns all registered validators
    */
    ApplicationContainer.prototype.getValidators = function () {
        return this.validators;
    };
    /**
    * @return returns all registered route method metadata
    */
    ApplicationContainer.prototype.getRoutes = function () {
        return this.routes;
    };
    /**
    * @return returns all registered intercepts method metadata
    */
    ApplicationContainer.prototype.getIntercepts = function () {
        var e_4, _a, e_5, _b;
        var copy = new Map();
        try {
            for (var _c = __values(this.intercepts.entries()), _d = _c.next(); !_d.done; _d = _c.next()) {
                var entry = _d.value;
                var metadata = new DefaultApplicationMethodMetadata(entry[1].getObject());
                try {
                    for (var _e = (e_5 = void 0, __values(entry[1].getMethods().entries())), _f = _e.next(); !_f.done; _f = _e.next()) {
                        var method = _f.value;
                        var intercepts = [];
                        for (var i = 0; i < method[1].length; i++) {
                            for (var j = 0; j < method[1].length; j++) {
                                if (i === j) {
                                    continue;
                                }
                                if (method[1][i]().name === method[1][j]().name) {
                                    throw core_1.error(entry[0], method[0], core_1.TeapotError.DUPLICATE_METHOD_INTERCEPTOR);
                                }
                            }
                            intercepts.push(method[1][i]().name);
                        }
                        metadata.methods.set(method[0], intercepts);
                    }
                }
                catch (e_5_1) { e_5 = { error: e_5_1 }; }
                finally {
                    try {
                        if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                    }
                    finally { if (e_5) throw e_5.error; }
                }
                copy.set(entry[0], metadata);
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_4) throw e_4.error; }
        }
        return copy;
    };
    /**
    * @return returns all registered controls method metadata
    */
    ApplicationContainer.prototype.getControls = function () {
        var e_6, _a, e_7, _b;
        var copy = new Map();
        try {
            for (var _c = __values(this.controls.entries()), _d = _c.next(); !_d.done; _d = _c.next()) {
                var entry = _d.value;
                var metadata = new DefaultApplicationMethodMetadata(entry[1].getObject());
                try {
                    for (var _e = (e_7 = void 0, __values(entry[1].getMethods().entries())), _f = _e.next(); !_f.done; _f = _e.next()) {
                        var method = _f.value;
                        metadata.methods.set(method[0], method[1]().name);
                    }
                }
                catch (e_7_1) { e_7 = { error: e_7_1 }; }
                finally {
                    try {
                        if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                    }
                    finally { if (e_7) throw e_7.error; }
                }
                copy.set(entry[0], metadata);
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_6) throw e_6.error; }
        }
        return copy;
    };
    /**
    * @return returns all registered validators
    */
    ApplicationContainer.prototype.getValidations = function () {
        return this.validations;
    };
    ApplicationContainer.unqiue = null;
    return ApplicationContainer;
}());
exports.ApplicationContainer = ApplicationContainer;
