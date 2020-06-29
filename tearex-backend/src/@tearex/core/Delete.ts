import { RouteFunction, HttpMethod } from ".";
import { ApplicationContainer } from "@tearex/internal";


export function Delete<T extends RouteFunction<{}>>(controller: Object, key: string, _descriptor: TypedPropertyDescriptor<T>): void {
    ApplicationContainer.getLinkInstance().registerRoute(controller, key, HttpMethod.DELETE);
}
