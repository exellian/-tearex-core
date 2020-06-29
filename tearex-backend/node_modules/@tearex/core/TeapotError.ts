export enum TeapotError {
    DUPLICATE_CONTROLLER = "Duplicate controller class!",
    DUPLICATE_SERVICE = "Duplicate service class!",
    DUPLICATE_INTERCEPTOR = "Duplicate interceptor class!",
    DUPLICATE_VALIDATOR = "Duplicate validator class!",
    DUPLICATE_METHOD_ROUTE = "Duplicate route method!",
    DUPLICATE_METHOD_INTERCEPT = "Can only use one intercept per method!",
    DUPLICATE_METHOD_INTERCEPTOR = "Duplicate interceptor on method!",
    DUPLICATE_METHOD_CONTROL = "Duplicate control on method! Methods can only have one sub controller!",
    DUPLICATE_INJECTABLE = "Duplicate injectable class!",
    DUPLICATE_PROPERTY_VALIDATOR = "Duplicate validator on property!",
    PRIMITIVE_DEPENDENCY_INJECTION = "Can not inject primitve fields!",
    FRAMEWORK_DEPENDENCY_INJECTION = "Can not inject fields that are part of the framework!",
    INJECTABLE_NOT_FOUND = "Injectable doesn't exist!",
    CIRCULAR_DEPENDENCY_INJECTION = "Circular dependency! Please remove circular dependencies!",
    SEALED_DEPENDENCY_INJECTION = "Sealed injectables can not be injected!",
    CONTROL_METHOD_ROUTE = "Control methods can not have route annotations!",
    ROUTE_METHOD_CONTROL = "Route methods can not have control annotations!",
    INTERCEPTOR_CONTROLLER_CONFLICT = "Interceptor can not be a controller at the same time!",
    INTERCEPTOR_SERVICE_CONFLICT = "Interceptor can not be a service at the same time!",
    CONTROLLER_SERVICE_CONFLICT = "Controller can not be a service at the same time!",
    CONTROLLER_INTERCEPTOR_CONFLICT = "Controller can not be a interceptor at the same time!",
    SERVICE_CONTROLLER_CONFLICT = "Service can not be a controller at the same time!",
    SERVICE_INTERCEPTOR_CONFLICT = "Service can not be a interceptor at the same time!",
    INTERCEPT_MISSING_CONTROL_OR_ROUTE = "Interception of this method missing a route or control annotation!",
    INTERCEPTOR_NOT_FOUND = "Interceptor not found!",
    CONTROLLER_NOT_FOUND = "Controller not found!",
    VALIDATOR_NOT_FOUND = "Validator not found!",
    CIRCULAR_CONTROLLER_HIERACHY = "Controller hierachy contains a circle!",
    CONTROL_METHOD_INVALID_PARAMETER = "Control method has invalid parameter!",
    INTERCEPT_METHOD_INVALID_PARAMETER = "Intercept method has invalid parameter!",
    INTERCEPT_METHOD_GLOBAL_OVERRRIDE_NOT_SUPPORTED = "Global intercepts are not supported for now!",
    INTERCEPT_METHOD_GLOBAL_OVERRRIDE = "Can not use interceptor that is already inherited!",
    METHOD_FORM_INVALID = "Please check the parameters of your toute method!",
    VALIDATION_FAILED = "Validation of object failed!",
}

export function error(controllerName: string, methodName: string | undefined, error: TeapotError, using: boolean = false): Error {
    let location: string = (methodName === undefined) ? "[" + controllerName + "]:" : "[" + controllerName + "][" + methodName + "]:";

    if (using) {
        return new Error("Using " + location + " " + error);
    }
    return new Error("At: " + location + " " + error);
}
