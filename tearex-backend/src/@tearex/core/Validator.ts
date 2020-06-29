import { ApplicationContainer } from "@tearex/internal";

export function Validator<T extends { new (...args: any[]): Validation }>(validatorConstructor: T): void {
    ApplicationContainer.getLinkInstance().registerValidator(validatorConstructor);
}

export interface Validation {
    validate(value: any): boolean;
}
