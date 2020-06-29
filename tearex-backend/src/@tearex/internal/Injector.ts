import "reflect-metadata";
import { TeapotError, error } from "@tearex/core";

interface InjectableMetadata {
    dependencies: string[] | undefined;
    constructor: { new (...args: any[]): {} };
    sealed: boolean;
}

export interface Injectable<T> {
    object: T;
    cache: Object | undefined;
}

export class Injector {

    private readonly injectableConstructors: Map<string, InjectableMetadata>;
    private readonly injectables: Map<string, Injectable<any>>;

    constructor() {
        this.injectableConstructors = new Map();
        this.injectables = new Map();
    }

    /**
    * Registers a class as unsealed. This means that the instance of the class can be injected to other injectables.
    * @param constructor must be a valid class
    */
    register<T extends { new (...args: any[]): {} }>(constructor: T): void {
        this.registerInjectable(constructor, false);
    }

    /**
    * Registers a class as sealed. This means that the instance of the class can not be injected to other injectables.
    * This means that the instance should only be used directly. For example: Controllers are sealed because they should
    * not be injected to Services or Interceptors
    * @param constructor must be a valid class
    */
    registerSealed<T extends { new (...args: any[]): {} }>(constructor: T): void {
        this.registerInjectable(constructor, true);
    }

    /**
    * @param name must be a valid class name where the class is registered either as sealed or unsealed
    */
    getLinkInstance(name: string): Injectable<any> {
        return this.getLinkInstanceHelper(name, false, []);
    }

    /**
    * @param name must be a valid class name where the class is registered either as sealed or unsealed
    * @param cache must be a object that should be stored in relation to the specified class name instance
    */
    setCache(name: string, cache: Object): void {
        let injectable: Injectable<any> | undefined = this.injectables.get(name);

        if (injectable !== undefined) {
            injectable.cache = cache;
        }
    }

    private registerInjectable<T extends { new (...args: any[]): {} }>(constructor: T, sealed: boolean): void {
        if (this.injectableConstructors.has(constructor.name)) {
            throw error(constructor.name, undefined, TeapotError.DUPLICATE_INJECTABLE, true);
        }
        this.injectableConstructors.set(constructor.name, {
            dependencies: undefined,
            constructor: constructor,
            sealed: sealed
        });
    }

    private getLinkInstanceHelper(name: string, recursive: boolean, dependent: string[]): Injectable<any> {
        let injectable: Injectable<any> | undefined = this.injectables.get(name);
        if (injectable === undefined) {

            let metadata: InjectableMetadata | undefined = this.injectableConstructors.get(name);

            if (metadata === undefined) {
                throw error(name, undefined, TeapotError.INJECTABLE_NOT_FOUND, true);
            }

            if (metadata.dependencies === undefined) {
                metadata.dependencies = Injector.getTypeNames(metadata.constructor);
            }
            let params: any[] = [];

            dependent.push(name);

            for (let typeName of metadata.dependencies) {
                for (let item of dependent) {
                    if (item === typeName) {
                        throw error(name, undefined, TeapotError.CIRCULAR_DEPENDENCY_INJECTION, true);
                    }
                }
                params.push(this.getLinkInstanceHelper(typeName, true, dependent).object);
            }

            if (metadata.sealed && recursive) {
                throw error(name, undefined, TeapotError.SEALED_DEPENDENCY_INJECTION, true);
            }
            injectable = {
                object: new metadata.constructor(...params),
                cache: undefined
            };

            this.injectables.set(name, injectable);
        }
        return injectable;
    }

    private static getTypeNames<T extends { new (...args: any[]): {} }>(constructor: T): string[] {

        let types: any = Reflect.getMetadata("design:paramtypes", <Object><unknown>constructor);


        let typeNames: string[] = [];

        if (types === undefined) {
            return typeNames;
        }

        for (let i = 0;i < types.length;i++) {
            let t: any = types[i]();
            if (Injector.checkPrimitiveType(t.name)) {
                throw error(constructor.name, undefined, TeapotError.PRIMITIVE_DEPENDENCY_INJECTION, true);
            }
            if (Injector.checkApplicationType(t.name)) {
                throw error(constructor.name, undefined, TeapotError.FRAMEWORK_DEPENDENCY_INJECTION, true);
            }
            typeNames.push(t.name);
        }
        return typeNames;
    }

    private static checkPrimitiveType(name: string): boolean {
        return name === "String" || name === "Boolean" || name === "Number" || name === "Function" || name === "Object";
    }

    private static checkApplicationType(name: string): boolean {
        return name === "Client" || name === "HttpHeaders";
    }
}
