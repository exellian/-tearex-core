# <img align="center" src="docs/logo.png" width="120" height="120"> <div style="font-size: 40px;">TeaRex</div>

# Getting Started

Welcome to the TeaRex framework. In this example we will create a simple backend API.

## Installation

Just run ```npm install @tearex/backend``` to install the framework.

## Hello World

app.ts:

```typescript

@Controller
class IndexController {

  //Simple Hello World
    @Get
    index(client: Client): void {
        client.end("Hallo Welt!");
    }
  
  
  //JSON Response
    @Get
    info(client: Client): void {
        client.end({
            id: 4,
            info: "This is an information response!"
        });
    }
}

Instance.new(8080);
```

Now run ```npm run build``` and after that run your script with node ```node app.js```. Now navigate to ```https://localhost:8080``` and you should get a Hello World! response.
When you navigate to ```https://localhost:8080/info``` you will get the JSON response.
