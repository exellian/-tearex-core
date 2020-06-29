import { ServerHttp2Stream } from "http2";
import { Client, HttpMethod, HttpStatus, View } from "@tearex/core";

export class DefaultNodeClient extends Client {

    private readonly stream: ServerHttp2Stream;
    private readonly httpMethod: HttpMethod;
    private ended: boolean;

    constructor(httpMethod: HttpMethod, stream: ServerHttp2Stream) {
        super();
        this.stream = stream;
        this.httpMethod = httpMethod;
        this.ended = false;
    }

    method(): HttpMethod {
        return this.httpMethod;
    }

    error(code: HttpStatus): void {
        if (this.ended) {
            throw new Error("Client can not be ended twice!");
        }
        this.stream.end({
            ':status': code
        });
    }

    end(object: string | Object | View): void {
        if (this.ended) {
            throw new Error("Client can not be ended twice!");
        }

        let res = <any>object;

        let contentType: string;

        if (typeof res === "string") {
            contentType = 'text/html';
        } else if (res.hasOwnProperty("render") && typeof res["render"] === "function") {
            contentType = 'text/html';
            res = (<View>res).render();
        } else {
            contentType = 'application/json';
            res = JSON.stringify(res);
        }
        this.stream.respond({
            'content-type': contentType,
            ':status': 200
        });
        this.stream.end(res);
    }

}
