import { Injector, Injectable } from ".";
import { TeapotError, error, Validation } from "@tearex/core";

export class Validator {

    private readonly injector: Injector;
    private readonly validations: ReadonlyMap<string, ReadonlyMap<string, readonly string[]>>;

    constructor(injector: Injector, validations: ReadonlyMap<string, ReadonlyMap<string, readonly string[]>>) {
        this.injector = injector;
        /**
        /* Deep copy of validatons for state independence
        */
        let copy: Map<string, Map<string, string[]>> = new Map();

        for (const validaton of validations.entries()) {
            let propertyValidation: Map<string, string[]> = new Map();
            for (const p of validaton[1].entries()) {
                let arr: string[] = new Array(p[1].length);

                for (let i: number = 0;i < p[1].length;i++) {
                    arr[i] = p[1][i];
                }
                propertyValidation.set(p[0], arr);
            }

            copy.set(validaton[0], propertyValidation);
        }
        this.validations = copy;
    }

    public validate<T extends Object>(object: any, objectConstructor: { new() : T }): T {
        if (object === null || undefined) {
            throw error(objectConstructor.name, undefined, TeapotError.VALIDATION_FAILED);
        }
        const validations: ReadonlyMap<string, readonly string[]> | undefined = this.validations.get(objectConstructor.name);

        if (validations === undefined) {
            throw error(objectConstructor.name, undefined, TeapotError.VALIDATION_FAILED);
        }

        for (const validaton of validations.entries()) {

            for (const validatorName of validaton[1]) {
                const validator: Injectable<Validation> = this.injector.getLinkInstance(validatorName);
                if (!validator.object.validate(object[validaton[0]])) {
                    throw error(objectConstructor.name, undefined, TeapotError.VALIDATION_FAILED);
                }
            }
        }
        return Object.assign(new objectConstructor(), object);
    }


}
