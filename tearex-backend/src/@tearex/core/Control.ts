import { ApplicationContainer } from "@tearex/internal";

export function Control(subcontroller: { new (...args: any[]): {} }) {
    return function<K extends () => void>(controller: Object, key: string, _descriptor: TypedPropertyDescriptor<K>) {
        ApplicationContainer.getLinkInstance().registerControl(controller, key, <() => { new (...args: any[]): {} }><unknown>subcontroller);
    };
}
