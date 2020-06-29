import { HttpServer, Router } from "..";
export declare class DefaultNodeHttpServer implements HttpServer {
    private readonly port;
    private readonly server;
    private readonly router;
    constructor(port: number, router: Router);
    serve(): void;
}
