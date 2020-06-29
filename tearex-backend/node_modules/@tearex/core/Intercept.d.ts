import { Interception, RouteFunction } from ".";
export declare function Intercept(...interceptorConstructors: ({
    new (...args: any[]): Interception;
})[]): <K extends RouteFunction<{}>>(controller: Object, key: string, _descriptor: TypedPropertyDescriptor<K>) => void;
