import { ApplicationContainer } from "@tearex/internal";
import { HttpHeaders, Client } from ".";

export function Intercepter<T extends { new (...args: any[]): Interception }>(interceptorConstructor: T): void {
    ApplicationContainer.getLinkInstance().registerInterceptor(interceptorConstructor);
}

export interface Interception {
    intercept(body: Buffer, headers: HttpHeaders, client: Client, next: () => void): void;
}
