"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@tearex/core");
var Session = /** @class */ (function () {
    function Session(test) {
        this.test = test;
    }
    return Session;
}());
var AuthService = /** @class */ (function () {
    function AuthService() {
        this.lel = 5;
    }
    AuthService = __decorate([
        core_1.Service,
        __metadata("design:paramtypes", [])
    ], AuthService);
    return AuthService;
}());
var AuthIntercepter = /** @class */ (function () {
    function AuthIntercepter(auth) {
        this.auth = auth;
    }
    AuthIntercepter.prototype.intercept = function (body, headers, client, next) {
        console.log(this.auth.lel);
        next();
    };
    AuthIntercepter = __decorate([
        core_1.Intercepter,
        __metadata("design:paramtypes", [function(){return AuthService;}])
    ], AuthIntercepter);
    return AuthIntercepter;
}());
var TestController = /** @class */ (function () {
    function TestController() {
    }
    TestController.prototype.index = function (client) {
        client.end("Hallo Test!");
    };
    TestController.prototype.test = function (client) {
        client.end("Test from Test!");
    };
    __decorate([
        core_1.Get,
        __metadata("design:type", function(){return Function;}),
        __metadata("design:paramtypes", [function(){return core_1.Client;}]),
        __metadata("design:returntype", void 0)
    ], TestController.prototype, "index", null);
    __decorate([
        core_1.Get,
        __metadata("design:type", function(){return Function;}),
        __metadata("design:paramtypes", [function(){return core_1.Client;}]),
        __metadata("design:returntype", void 0)
    ], TestController.prototype, "test", null);
    TestController = __decorate([
        core_1.Controller
    ], TestController);
    return TestController;
}());
var IndexController = /** @class */ (function () {
    function IndexController() {
    }
    IndexController.prototype.test = function () { };
    IndexController.prototype.index = function (client) {
        client.end("Hallo");
    };
    __decorate([
        core_1.Intercept(function(){return AuthIntercepter;}),
        core_1.Control(function() {return TestController;}),
        __metadata("design:type", function(){return Function;}),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], IndexController.prototype, "test", null);
    __decorate([
        core_1.Get,
        core_1.Post,
        core_1.Intercept(function(){return AuthIntercepter;}),
        __metadata("design:type", function(){return Function;}),
        __metadata("design:paramtypes", [function(){return core_1.Client;}]),
        __metadata("design:returntype", void 0)
    ], IndexController.prototype, "index", null);
    IndexController = __decorate([
        core_1.Controller,
        __metadata("design:paramtypes", [])
    ], IndexController);
    return IndexController;
}());
core_1.Instance.new(8080);
