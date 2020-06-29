"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpContainer = void 0;
var _1 = require(".");
var HttpContainer = /** @class */ (function () {
    function HttpContainer() {
        this.unqiues = new Map();
    }
    HttpContainer.getLinkInstance = function () {
        if (HttpContainer.unqiue === null) {
            HttpContainer.unqiue = new HttpContainer();
        }
        return HttpContainer.unqiue;
    };
    HttpContainer.prototype.getLinkInstance = function (port, router) {
        var server = this.unqiues.get(port);
        if (server === undefined) {
            server = this.getDefaultInstance(port, router);
            this.unqiues.set(port, server);
        }
        return server;
    };
    HttpContainer.prototype.getDefaultInstance = function (port, router) {
        return new _1.DefaultNodeHttpServer(port, router);
    };
    HttpContainer.unqiue = null;
    return HttpContainer;
}());
exports.HttpContainer = HttpContainer;
