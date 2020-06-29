"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultNodeClient = void 0;
var core_1 = require("@tearex/core");
var DefaultNodeClient = /** @class */ (function (_super) {
    __extends(DefaultNodeClient, _super);
    function DefaultNodeClient(httpMethod, stream) {
        var _this = _super.call(this) || this;
        _this.stream = stream;
        _this.httpMethod = httpMethod;
        _this.ended = false;
        return _this;
    }
    DefaultNodeClient.prototype.method = function () {
        return this.httpMethod;
    };
    DefaultNodeClient.prototype.error = function (code) {
        if (this.ended) {
            throw new Error("Client can not be ended twice!");
        }
        this.stream.end({
            ':status': code
        });
    };
    DefaultNodeClient.prototype.end = function (object) {
        if (this.ended) {
            throw new Error("Client can not be ended twice!");
        }
        var res = object;
        var contentType;
        if (typeof res === "string") {
            contentType = 'text/html';
        }
        else if (res.hasOwnProperty("render") && typeof res["render"] === "function") {
            contentType = 'text/html';
            res = res.render();
        }
        else {
            contentType = 'application/json';
            res = JSON.stringify(res);
        }
        this.stream.respond({
            'content-type': contentType,
            ':status': 200
        });
        this.stream.end(res);
    };
    return DefaultNodeClient;
}(core_1.Client));
exports.DefaultNodeClient = DefaultNodeClient;
