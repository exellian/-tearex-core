/// <reference types="node" />
import { HttpHeaders, Client } from ".";
export declare function Intercepter<T extends {
    new (...args: any[]): Interception;
}>(interceptorConstructor: T): void;
export interface Interception {
    intercept(body: Buffer, headers: HttpHeaders, client: Client, next: () => void): void;
}
