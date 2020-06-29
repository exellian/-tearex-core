import { Http2Server, ServerHttp2Stream, IncomingHttpHeaders, createSecureServer } from "http2";
import { readFileSync } from "fs";
import { HttpServer, Router, DefaultNodeClient } from "..";
import { HttpMethod } from "@tearex/core";

export class DefaultNodeHttpServer implements HttpServer {

    private readonly port: number;
    private readonly server: Http2Server;
    private readonly router: Router;

    constructor(port: number, router: Router) {
        this.port = port;
        this.router = router;
        this.server = createSecureServer({
            key: readFileSync('localhost.key'),
            cert: readFileSync('localhost.crt'),
            allowHTTP1: true
        });

        this.server.on("stream", (stream: ServerHttp2Stream, headers: IncomingHttpHeaders, _flags: number) => {

            let chunks: any[] = [];
            let self: DefaultNodeHttpServer = this;

            stream.on('data', (chunk: string | Buffer) => {
                chunks.push(chunk);
            });

            stream.on('end', () => {
                let body: Buffer = Buffer.concat(chunks);
                chunks = [];

                let path: string | undefined = headers[":path"];
                if (path === undefined) {
                    //bad request
                    return;
                }

                let method: HttpMethod | undefined = <HttpMethod>headers[":method"];
                if (method === undefined) {
                    //bad request
                    return;
                }

                self.router.route(path, method, body, headers, new DefaultNodeClient(method, stream));
            });
        });
    }

    serve(): void {
        this.server.listen(this.port);
    }

}
