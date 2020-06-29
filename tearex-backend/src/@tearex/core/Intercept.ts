import { Interception, RouteFunction } from ".";
import { ApplicationContainer } from "@tearex/internal";

export function Intercept(...interceptorConstructors: ({ new (...args: any[]): Interception })[]) {
    return function<K extends RouteFunction<{}>>(controller: Object, key: string, _descriptor: TypedPropertyDescriptor<K>) {
        ApplicationContainer.getLinkInstance().registerIntercept(controller, key, <(() => { new (...args: any[]): Interception })[]><unknown>interceptorConstructors);
    };
}
