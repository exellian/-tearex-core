import { ApplicationContainer } from "@tearex/internal";

export function Service<T extends { new (...args: any[]): {} }>(constructor: T): void {
    ApplicationContainer.getLinkInstance().registerService(constructor);
}
