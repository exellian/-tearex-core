/// <reference types="node" />
import { Router } from "@tearex/internal";
import { HttpMethod, Client, HttpHeaders } from ".";
export declare class Instance implements Router {
    private readonly injector;
    private readonly validator;
    private readonly routes;
    private constructor();
    private init;
    private initRoutesAndInterceptors;
    private static checkControls;
    private static getParameterConstructors;
    private static intercept;
    private injectNormal;
    private parseBody;
    route(path: string, method: HttpMethod, buffer: Buffer, headers: HttpHeaders, client: Client): void;
    static new(port: number): void;
}
