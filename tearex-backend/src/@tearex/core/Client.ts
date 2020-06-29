import { View, HttpStatus, HttpMethod } from ".";

export abstract class Client {

    abstract end(object: View | string | Object): void;
    abstract error(code: HttpStatus): void;
    abstract method(): HttpMethod;
}
