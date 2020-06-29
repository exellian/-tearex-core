import { ApplicationContainer } from "@tearex/internal";
import { Validation, Validator } from ".";

export function Required(message: Object, key: string) {

    @Validator
    class RequiredValidator implements Validation {

        validate(value: any): boolean {
            return value !== undefined && value !== null;
        }

    }
    ApplicationContainer.getLinkInstance().registerValidaton(message, key, RequiredValidator);
}
