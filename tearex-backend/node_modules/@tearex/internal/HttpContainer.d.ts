import { HttpServer, Router } from ".";
export declare class HttpContainer {
    private static unqiue;
    private readonly unqiues;
    private constructor();
    static getLinkInstance(): HttpContainer;
    getLinkInstance(port: number, router: Router): HttpServer;
    private getDefaultInstance;
}
