<img src="logo_text.png" width="447" height="120">

# Backend

## Getting Started

Welcome to the TeaRex backend framework. With this framework you can create extensive API services. Core features are controllers, services, interceptors, data persistence, models, automatic validation. In this example we will create a simple backend API that will respond to an incoming request with Hallo World!

### Installation

Simply install the cli with ```npm install -g @tearex/cli```


### Hello World

1. Use the cli with the command ```rex backend test``` or ```rex b test``` to create a new backend project in a folder called test

2. Now navigate in this newly created folder and create a file called for example app.ts:

```typescript

@Controller
class IndexController {

  //Simple Hello World
    @Get
    index(client: Client): void {
        client.end("Hallo Welt!");
    }
}

Instance.new(8080);
```

Now run ```rex serve``` and navigate to ```https://localhost:8080``` and you should get a "Hello World!" response.
