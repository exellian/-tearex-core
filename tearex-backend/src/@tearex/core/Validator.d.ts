export declare function Validator<T extends {
    new (...args: any[]): Validation;
}>(validatorConstructor: T): void;
export interface Validation {
    validate(value: any): boolean;
}
