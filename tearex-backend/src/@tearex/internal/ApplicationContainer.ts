import { Interception, Validation, HttpMethod, TeapotError, error } from "@tearex/core";

export interface ReadonlyApplicationMethodMetadata<T> {

    getObject(): Object;
    getMethods(): ReadonlyMap<string, T>;
}

interface ApplicationMethodMetadata<T> extends ReadonlyApplicationMethodMetadata<T> {
    controller: Object;
    methods: Map<string, T>;
}

class DefaultApplicationMethodMetadata<T> implements ApplicationMethodMetadata<T> {

    readonly controller: Object;
    readonly methods: Map<string, T>;

    constructor(controller: Object) {
        this.controller = controller;
        this.methods = new Map();
    }

    getObject(): Object {
        return this.controller;
    }
    getMethods(): ReadonlyMap<string, T> {
        return this.methods;
    }
}

/**
* Registers all functions and classes that are annotated
*/
export class ApplicationContainer {

    private static unqiue: ApplicationContainer | null = null;

    private readonly controllers: Map<string, { new (...args: any[]): {} }>;
    private readonly services: Map<string, { new (...args: any[]): {} }>;
    private readonly interceptors: Map<string, { new (...args: any[]): Interception }>;
    private readonly validators: Map<string, { new (...args: any[]): Validation }>;
    private readonly routes: Map<string, ApplicationMethodMetadata<HttpMethod[]>>;
    private readonly intercepts: Map<string, ApplicationMethodMetadata<(() => { new (...args: any[]): {} })[]>>;
    private readonly controls: Map<string, ApplicationMethodMetadata<() => { new (...args: any[]): {} }>>;
    private readonly validations: Map<string, Map<string, string[]>>;

    static getLinkInstance(): ApplicationContainer {
        if (ApplicationContainer.unqiue === null) {
            ApplicationContainer.unqiue = new ApplicationContainer();
        }
        return ApplicationContainer.unqiue;
    }

    private constructor() {
        this.controllers = new Map();
        this.services = new Map();
        this.interceptors = new Map();
        this.validators = new Map();
        this.routes = new Map();
        this.intercepts = new Map();
        this.controls = new Map();
        this.validations = new Map();
    }

    /**
    * Registers a controllers
    * @param constructor must be a valid controller constructor
    */
    registerController<T extends { new (...args: any[]): {} }>(constructor: T): void {

        if (this.services.has(constructor.name)) {
            throw error(constructor.name, undefined, TeapotError.CONTROLLER_SERVICE_CONFLICT);
        }
        if (this.interceptors.has(constructor.name)) {
            throw error(constructor.name, undefined, TeapotError.CONTROLLER_INTERCEPTOR_CONFLICT);
        }
        if (this.controllers.has(constructor.name)) {
            throw error(constructor.name, undefined, TeapotError.DUPLICATE_CONTROLLER);
        }
        this.controllers.set(constructor.name, constructor);
    }

    /**
    * Registers a Service
    * @param constructor must be a valid service constructor
    */
    registerService<T extends { new (...args: any[]): {} }>(constructor: T): void {

        if (this.controllers.has(constructor.name)) {
            throw error(constructor.name, undefined, TeapotError.SERVICE_CONTROLLER_CONFLICT);
        }
        if (this.interceptors.has(constructor.name)) {
            throw error(constructor.name, undefined, TeapotError.SERVICE_INTERCEPTOR_CONFLICT);
        }
        if (this.services.has(constructor.name)) {
            throw error(constructor.name, undefined, TeapotError.DUPLICATE_SERVICE);
        }
        this.services.set(constructor.name, constructor);
    }

    /**
    * Registers a Interceptor
    * @param constructor must be a valid interceptor constructor
    */
    registerInterceptor<T extends { new (...args: any[]): Interception }>(constructor: T): void {

        if (this.controllers.has(constructor.name)) {
            throw error(constructor.name, undefined, TeapotError.INTERCEPTOR_CONTROLLER_CONFLICT);
        }
        if (this.services.has(constructor.name)) {
            throw error(constructor.name, undefined, TeapotError.INTERCEPTOR_SERVICE_CONFLICT);
        }
        if (this.interceptors.has(constructor.name)) {
            throw error(constructor.name, undefined, TeapotError.DUPLICATE_INTERCEPTOR);
        }
        this.interceptors.set(constructor.name, constructor);
    }

    /**
    * Registers a Validator
    * @param constructor must be a valid validator constructor
    */
    registerValidator<T extends { new (...args: any[]): Validation }>(constructor: T): void {

        if (this.validators.has(constructor.name)) {
            throw error(constructor.name, undefined, TeapotError.DUPLICATE_VALIDATOR);
        }
        this.validators.set(constructor.name, constructor);
    }

    /**
    * Registers a route method
    * @param controller must be a valid controller class objects
    * @param methodName must be a valid method in the controller class object
    * @param httpMethod must be the Http method for this route
    */
    registerRoute(controller: Object, methodName: string, httpMethod: HttpMethod): void {
        let metadataControls: ApplicationMethodMetadata<(() => { new (...args: any[]): {} })> | undefined = this.controls.get(controller.constructor.name)

        if (metadataControls !== undefined) {
            if (metadataControls.methods.has(methodName)) {
                throw error(controller.constructor.name, methodName, TeapotError.CONTROL_METHOD_ROUTE);
            }
        }

        let metadata: ApplicationMethodMetadata<HttpMethod[]> | undefined =  this.routes.get(controller.constructor.name);

        if (metadata === undefined) {
            metadata = new DefaultApplicationMethodMetadata(controller);
            this.routes.set(controller.constructor.name, metadata);
        }

        let httpMethods: HttpMethod[] | undefined = metadata.methods.get(methodName);

        if (httpMethods === undefined) {
            httpMethods = [];
            metadata.methods.set(methodName, httpMethods);
        }

        for (let m of httpMethods) {
            if (m === httpMethod) {
                throw error(controller.constructor.name, methodName, TeapotError.DUPLICATE_METHOD_ROUTE);
            }
        }
        httpMethods.push(httpMethod);

    }

    /**
    * Registers a intercept for a route or control method
    * @param controller must be a valid controller class objects
    * @param methodName must be a valid method in the controller class object
    * @param interceptor must be a valid interceptor class
    */
    registerIntercept(controller: Object, methodName: string, interceptorConstructors: (() => { new (...args: any[]): {} })[]): void {
        let metadata: ApplicationMethodMetadata<(() => { new (...args: any[]): {} })[]> | undefined =  this.intercepts.get(controller.constructor.name);

        if (metadata === undefined) {
            metadata = new DefaultApplicationMethodMetadata(controller);
            this.intercepts.set(controller.constructor.name, metadata);
        }
        let interceptors: (() => { new (...args: any[]): {} })[] | undefined = metadata.methods.get(methodName);
        if (interceptors !== undefined) {
            throw error(controller.constructor.name, methodName, TeapotError.DUPLICATE_METHOD_INTERCEPT);
        }
        interceptors = [];
        metadata.methods.set(methodName, interceptors);

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
        for (const interceptorConstructor of interceptorConstructors) {
            interceptors.push(interceptorConstructor);
        }
    }

    /**
    * Registers a intercept for a route or control method
    * @param controller must be a valid controller class objects
    * @param methodName must be a valid method in the controller class object
    * @param subcontroller must be a valid controller class producer
    */
    registerControl(controller: Object, methodName: string, subcontroller: () => { new (...args: any[]): {} }): void {
        let metadataRoutes: ApplicationMethodMetadata<HttpMethod[]> | undefined = this.routes.get(controller.constructor.name)

        if (metadataRoutes !== undefined) {
            if (metadataRoutes.methods.has(methodName)) {
                throw error(controller.constructor.name, methodName, TeapotError.ROUTE_METHOD_CONTROL);
            }
        }

        let metadata: ApplicationMethodMetadata<() => { new (...args: any[]): {} }> | undefined =  this.controls.get(controller.constructor.name);

        if (metadata === undefined) {
            metadata = new DefaultApplicationMethodMetadata(controller);
            this.controls.set(controller.constructor.name, metadata);
        }

        if (metadata.methods.has(methodName)) {
            throw error(controller.constructor.name, methodName, TeapotError.DUPLICATE_METHOD_CONTROL);
        }
        metadata.methods.set(methodName, subcontroller);
    }

    /**
    * Registers a validation for any message class of a given property
    * @param message must be a object of a class with empty constructor
    * @param propertyName must be a valid property in the message class
    * @param validator must be a valid class of a registered Validator
    */
    registerValidaton(message: Object, propertyName: string, validator: { new(...args: any[]): Validation }): void {

        let validationProperties: Map<string, string[]> | undefined = this.validations.get(message.constructor.name);

        if (validationProperties === undefined) {
            validationProperties = new Map();
            this.validations.set(message.constructor.name, validationProperties);
        }

        let validations: string[] | undefined = validationProperties.get(propertyName);

        if (validations === undefined) {
            validations = [];
            validationProperties.set(propertyName, validations);
        }

        for (let v of validations) {
            if (v === validator.name) {
                throw error(message.constructor.name, propertyName, TeapotError.DUPLICATE_PROPERTY_VALIDATOR);
            }
        }
        validations.push(validator.name);
    }

    /**
    * @return returns all registered controllers
    */
    getControllers(): ReadonlyMap<string, { new (...args: any[]): {} }> {
        return this.controllers;
    }

    /**
    * @return returns all registered services
    */
    getServices(): ReadonlyMap<string, { new (...args: any[]): {} }> {
        return this.services;
    }

    /**
    * @return returns all registered interceptors
    */
    getInterceptors(): ReadonlyMap<string, { new (...args: any[]): Interception }> {
        return this.interceptors;
    }

    /**
    * @return returns all registered validators
    */
    getValidators(): ReadonlyMap<string, { new (...args: any[]): Validation }> {
        return this.validators;
    }

    /**
    * @return returns all registered route method metadata
    */
    getRoutes(): ReadonlyMap<string, ReadonlyApplicationMethodMetadata<readonly HttpMethod[]>> {
        return this.routes;
    }

    /**
    * @return returns all registered intercepts method metadata
    */
    getIntercepts(): ReadonlyMap<string, ReadonlyApplicationMethodMetadata<readonly string[]>> {
        const copy: Map<string, ApplicationMethodMetadata<string[]>> = new Map();

        for (const entry of this.intercepts.entries()) {
            let metadata: ApplicationMethodMetadata<string[]> = new DefaultApplicationMethodMetadata(entry[1].getObject());

            for (const method of entry[1].getMethods().entries()) {
                const intercepts: string[] = [];

                for (let i = 0;i < method[1].length;i++) {
                    for (let j = 0;j < method[1].length;j++) {
                        if (i === j) {
                            continue;
                        }

                        if (method[1][i]().name === method[1][j]().name) {
                            throw error(entry[0], method[0], TeapotError.DUPLICATE_METHOD_INTERCEPTOR);
                        }
                    }
                    intercepts.push(method[1][i]().name);
                }
                metadata.methods.set(method[0], intercepts);
            }
            copy.set(entry[0], metadata);
        }
        return copy;
    }

    /**
    * @return returns all registered controls method metadata
    */
    getControls(): ReadonlyMap<string, ReadonlyApplicationMethodMetadata<string>> {
        const copy: Map<string, ApplicationMethodMetadata<string>> = new Map();

        for (const entry of this.controls.entries()) {
            let metadata: ApplicationMethodMetadata<string> = new DefaultApplicationMethodMetadata(entry[1].getObject());

            for (const method of entry[1].getMethods().entries()) {
                metadata.methods.set(method[0], method[1]().name);
            }
            copy.set(entry[0], metadata);
        }

        return copy;
    }

    /**
    * @return returns all registered validators
    */
    getValidations(): ReadonlyMap<string, ReadonlyMap<string, readonly string[]>> {
        return this.validations;
    }

}
