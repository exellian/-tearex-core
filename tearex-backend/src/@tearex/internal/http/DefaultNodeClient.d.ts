/// <reference types="node" />
import { ServerHttp2Stream } from "http2";
import { Client, HttpMethod, HttpStatus, View } from "@tearex/core";
export declare class DefaultNodeClient extends Client {
    private readonly stream;
    private readonly httpMethod;
    private ended;
    constructor(httpMethod: HttpMethod, stream: ServerHttp2Stream);
    method(): HttpMethod;
    error(code: HttpStatus): void;
    end(object: string | Object | View): void;
}
