import { View, HttpStatus, HttpMethod } from ".";
export declare abstract class Client {
    abstract end(object: View | string | Object): void;
    abstract error(code: HttpStatus): void;
    abstract method(): HttpMethod;
}
