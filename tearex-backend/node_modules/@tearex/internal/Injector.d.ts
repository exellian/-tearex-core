import "reflect-metadata";
export interface Injectable<T> {
    object: T;
    cache: Object | undefined;
}
export declare class Injector {
    private readonly injectableConstructors;
    private readonly injectables;
    constructor();
    /**
    * Registers a class as unsealed. This means that the instance of the class can be injected to other injectables.
    * @param constructor must be a valid class
    */
    register<T extends {
        new (...args: any[]): {};
    }>(constructor: T): void;
    /**
    * Registers a class as sealed. This means that the instance of the class can not be injected to other injectables.
    * This means that the instance should only be used directly. For example: Controllers are sealed because they should
    * not be injected to Services or Interceptors
    * @param constructor must be a valid class
    */
    registerSealed<T extends {
        new (...args: any[]): {};
    }>(constructor: T): void;
    /**
    * @param name must be a valid class name where the class is registered either as sealed or unsealed
    */
    getLinkInstance(name: string): Injectable<any>;
    /**
    * @param name must be a valid class name where the class is registered either as sealed or unsealed
    * @param cache must be a object that should be stored in relation to the specified class name instance
    */
    setCache(name: string, cache: Object): void;
    private registerInjectable;
    private getLinkInstanceHelper;
    private static getTypeNames;
    private static checkPrimitiveType;
    private static checkApplicationType;
}
