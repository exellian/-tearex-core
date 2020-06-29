import { HttpMethod, HttpHeaders, Client } from "@tearex/core";

export interface Router {
    route(path: string, method: HttpMethod, buffer: Buffer, headers: HttpHeaders, client: Client): void;
}
