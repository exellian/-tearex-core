export declare function Control(subcontroller: {
    new (...args: any[]): {};
}): <K extends () => void>(controller: Object, key: string, _descriptor: TypedPropertyDescriptor<K>) => void;
