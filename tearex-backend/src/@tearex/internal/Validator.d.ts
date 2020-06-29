import { Injector } from ".";
export declare class Validator {
    private readonly injector;
    private readonly validations;
    constructor(injector: Injector, validations: ReadonlyMap<string, ReadonlyMap<string, readonly string[]>>);
    validate<T extends Object>(object: any, objectConstructor: {
        new (): T;
    }): T;
}
