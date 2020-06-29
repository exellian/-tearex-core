"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultNodeHttpServer = void 0;
var http2_1 = require("http2");
var fs_1 = require("fs");
var __1 = require("..");
var DefaultNodeHttpServer = /** @class */ (function () {
    function DefaultNodeHttpServer(port, router) {
        var _this = this;
        this.port = port;
        this.router = router;
        this.server = http2_1.createSecureServer({
            key: fs_1.readFileSync('localhost.key'),
            cert: fs_1.readFileSync('localhost.crt'),
            allowHTTP1: true
        });
        this.server.on("stream", function (stream, headers, _flags) {
            var chunks = [];
            var self = _this;
            stream.on('data', function (chunk) {
                chunks.push(chunk);
            });
            stream.on('end', function () {
                var body = Buffer.concat(chunks);
                chunks = [];
                var path = headers[":path"];
                if (path === undefined) {
                    //bad request
                    return;
                }
                var method = headers[":method"];
                if (method === undefined) {
                    //bad request
                    return;
                }
                self.router.route(path, method, body, headers, new __1.DefaultNodeClient(method, stream));
            });
        });
    }
    DefaultNodeHttpServer.prototype.serve = function () {
        this.server.listen(this.port);
    };
    return DefaultNodeHttpServer;
}());
exports.DefaultNodeHttpServer = DefaultNodeHttpServer;
