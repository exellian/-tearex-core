import { Service, Intercepter, Interception, HttpHeaders, Client, Controller, Get, Intercept, Control, Post, Instance } from "@tearex/core";

class Session {

    test: number;

    constructor(test: number) {
        this.test = test;
    }
}

@Service
class AuthService {

    lel: number = 5;

    constructor() {

    }
}

@Intercepter
class AuthIntercepter implements Interception {

    private readonly auth: AuthService;

    constructor(auth: AuthService) {
        this.auth = auth;
    }

    intercept(body: Buffer, headers: HttpHeaders, client: Client, next: () => void): void {

        console.log(this.auth.lel);
        next();
    }
}

@Controller
class TestController {

    @Get
    index(client: Client): void {
        client.end("Hallo Test!");
    }

    @Get
    test(client: Client): void {
        client.end("Test from Test!");
    }
}

@Controller
class IndexController {

    constructor() {
    }

    @Intercept(AuthIntercepter)
    @Control(TestController)
    test(): void {}

    @Get
    @Post
    @Intercept(AuthIntercepter)
    index(client: Client): void {

        client.end("Hallo");
    }

}
Instance.new(8080);
