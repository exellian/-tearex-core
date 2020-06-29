"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.error = exports.TeapotError = void 0;
var TeapotError;
(function (TeapotError) {
    TeapotError["DUPLICATE_CONTROLLER"] = "Duplicate controller class!";
    TeapotError["DUPLICATE_SERVICE"] = "Duplicate service class!";
    TeapotError["DUPLICATE_INTERCEPTOR"] = "Duplicate interceptor class!";
    TeapotError["DUPLICATE_VALIDATOR"] = "Duplicate validator class!";
    TeapotError["DUPLICATE_METHOD_ROUTE"] = "Duplicate route method!";
    TeapotError["DUPLICATE_METHOD_INTERCEPT"] = "Can only use one intercept per method!";
    TeapotError["DUPLICATE_METHOD_INTERCEPTOR"] = "Duplicate interceptor on method!";
    TeapotError["DUPLICATE_METHOD_CONTROL"] = "Duplicate control on method! Methods can only have one sub controller!";
    TeapotError["DUPLICATE_INJECTABLE"] = "Duplicate injectable class!";
    TeapotError["DUPLICATE_PROPERTY_VALIDATOR"] = "Duplicate validator on property!";
    TeapotError["PRIMITIVE_DEPENDENCY_INJECTION"] = "Can not inject primitve fields!";
    TeapotError["FRAMEWORK_DEPENDENCY_INJECTION"] = "Can not inject fields that are part of the framework!";
    TeapotError["INJECTABLE_NOT_FOUND"] = "Injectable doesn't exist!";
    TeapotError["CIRCULAR_DEPENDENCY_INJECTION"] = "Circular dependency! Please remove circular dependencies!";
    TeapotError["SEALED_DEPENDENCY_INJECTION"] = "Sealed injectables can not be injected!";
    TeapotError["CONTROL_METHOD_ROUTE"] = "Control methods can not have route annotations!";
    TeapotError["ROUTE_METHOD_CONTROL"] = "Route methods can not have control annotations!";
    TeapotError["INTERCEPTOR_CONTROLLER_CONFLICT"] = "Interceptor can not be a controller at the same time!";
    TeapotError["INTERCEPTOR_SERVICE_CONFLICT"] = "Interceptor can not be a service at the same time!";
    TeapotError["CONTROLLER_SERVICE_CONFLICT"] = "Controller can not be a service at the same time!";
    TeapotError["CONTROLLER_INTERCEPTOR_CONFLICT"] = "Controller can not be a interceptor at the same time!";
    TeapotError["SERVICE_CONTROLLER_CONFLICT"] = "Service can not be a controller at the same time!";
    TeapotError["SERVICE_INTERCEPTOR_CONFLICT"] = "Service can not be a interceptor at the same time!";
    TeapotError["INTERCEPT_MISSING_CONTROL_OR_ROUTE"] = "Interception of this method missing a route or control annotation!";
    TeapotError["INTERCEPTOR_NOT_FOUND"] = "Interceptor not found!";
    TeapotError["CONTROLLER_NOT_FOUND"] = "Controller not found!";
    TeapotError["VALIDATOR_NOT_FOUND"] = "Validator not found!";
    TeapotError["CIRCULAR_CONTROLLER_HIERACHY"] = "Controller hierachy contains a circle!";
    TeapotError["CONTROL_METHOD_INVALID_PARAMETER"] = "Control method has invalid parameter!";
    TeapotError["INTERCEPT_METHOD_INVALID_PARAMETER"] = "Intercept method has invalid parameter!";
    TeapotError["INTERCEPT_METHOD_GLOBAL_OVERRRIDE_NOT_SUPPORTED"] = "Global intercepts are not supported for now!";
    TeapotError["INTERCEPT_METHOD_GLOBAL_OVERRRIDE"] = "Can not use interceptor that is already inherited!";
    TeapotError["METHOD_FORM_INVALID"] = "Please check the parameters of your toute method!";
    TeapotError["VALIDATION_FAILED"] = "Validation of object failed!";
})(TeapotError = exports.TeapotError || (exports.TeapotError = {}));
function error(controllerName, methodName, error, using) {
    if (using === void 0) { using = false; }
    var location = (methodName === undefined) ? "[" + controllerName + "]:" : "[" + controllerName + "][" + methodName + "]:";
    if (using) {
        return new Error("Using " + location + " " + error);
    }
    return new Error("At: " + location + " " + error);
}
exports.error = error;
