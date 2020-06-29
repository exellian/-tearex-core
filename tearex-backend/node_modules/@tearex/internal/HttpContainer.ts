import { HttpServer, Router, DefaultNodeHttpServer } from ".";

export class HttpContainer {

    private static unqiue: HttpContainer | null = null;

    private readonly unqiues: Map<number, HttpServer> = new Map();

    private constructor() {}

    static getLinkInstance(): HttpContainer {
        if (HttpContainer.unqiue === null) {
            HttpContainer.unqiue = new HttpContainer();
        }
        return HttpContainer.unqiue;
    }

    getLinkInstance(port: number, router: Router): HttpServer {
        let server: HttpServer | undefined = this.unqiues.get(port);

        if (server === undefined) {
            server = this.getDefaultInstance(port, router);
            this.unqiues.set(port, server);
        }
        return server;
    }

    private getDefaultInstance(port: number, router: Router): HttpServer {
        return new DefaultNodeHttpServer(port, router);
    }
}
