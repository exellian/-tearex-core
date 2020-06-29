import { Interception, Validation, HttpMethod } from "@tearex/core";
export interface ReadonlyApplicationMethodMetadata<T> {
    getObject(): Object;
    getMethods(): ReadonlyMap<string, T>;
}
/**
* Registers all functions and classes that are annotated
*/
export declare class ApplicationContainer {
    private static unqiue;
    private readonly controllers;
    private readonly services;
    private readonly interceptors;
    private readonly validators;
    private readonly routes;
    private readonly intercepts;
    private readonly controls;
    private readonly validations;
    static getLinkInstance(): ApplicationContainer;
    private constructor();
    /**
    * Registers a controllers
    * @param constructor must be a valid controller constructor
    */
    registerController<T extends {
        new (...args: any[]): {};
    }>(constructor: T): void;
    /**
    * Registers a Service
    * @param constructor must be a valid service constructor
    */
    registerService<T extends {
        new (...args: any[]): {};
    }>(constructor: T): void;
    /**
    * Registers a Interceptor
    * @param constructor must be a valid interceptor constructor
    */
    registerInterceptor<T extends {
        new (...args: any[]): Interception;
    }>(constructor: T): void;
    /**
    * Registers a Validator
    * @param constructor must be a valid validator constructor
    */
    registerValidator<T extends {
        new (...args: any[]): Validation;
    }>(constructor: T): void;
    /**
    * Registers a route method
    * @param controller must be a valid controller class objects
    * @param methodName must be a valid method in the controller class object
    * @param httpMethod must be the Http method for this route
    */
    registerRoute(controller: Object, methodName: string, httpMethod: HttpMethod): void;
    /**
    * Registers a intercept for a route or control method
    * @param controller must be a valid controller class objects
    * @param methodName must be a valid method in the controller class object
    * @param interceptor must be a valid interceptor class
    */
    registerIntercept(controller: Object, methodName: string, interceptorConstructors: (() => {
        new (...args: any[]): {};
    })[]): void;
    /**
    * Registers a intercept for a route or control method
    * @param controller must be a valid controller class objects
    * @param methodName must be a valid method in the controller class object
    * @param subcontroller must be a valid controller class producer
    */
    registerControl(controller: Object, methodName: string, subcontroller: () => {
        new (...args: any[]): {};
    }): void;
    /**
    * Registers a validation for any message class of a given property
    * @param message must be a object of a class with empty constructor
    * @param propertyName must be a valid property in the message class
    * @param validator must be a valid class of a registered Validator
    */
    registerValidaton(message: Object, propertyName: string, validator: {
        new (...args: any[]): Validation;
    }): void;
    /**
    * @return returns all registered controllers
    */
    getControllers(): ReadonlyMap<string, {
        new (...args: any[]): {};
    }>;
    /**
    * @return returns all registered services
    */
    getServices(): ReadonlyMap<string, {
        new (...args: any[]): {};
    }>;
    /**
    * @return returns all registered interceptors
    */
    getInterceptors(): ReadonlyMap<string, {
        new (...args: any[]): Interception;
    }>;
    /**
    * @return returns all registered validators
    */
    getValidators(): ReadonlyMap<string, {
        new (...args: any[]): Validation;
    }>;
    /**
    * @return returns all registered route method metadata
    */
    getRoutes(): ReadonlyMap<string, ReadonlyApplicationMethodMetadata<readonly HttpMethod[]>>;
    /**
    * @return returns all registered intercepts method metadata
    */
    getIntercepts(): ReadonlyMap<string, ReadonlyApplicationMethodMetadata<readonly string[]>>;
    /**
    * @return returns all registered controls method metadata
    */
    getControls(): ReadonlyMap<string, ReadonlyApplicationMethodMetadata<string>>;
    /**
    * @return returns all registered validators
    */
    getValidations(): ReadonlyMap<string, ReadonlyMap<string, readonly string[]>>;
}
