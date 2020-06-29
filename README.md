# Getting Started

Welcome to the TeaRex framework. In this example we will create a simple backend API.


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

Now run ```npm run build``` and navigate to ```https://localhost:8080```. And you should get a Hello World! response.
When you navigate to ```https://localhost:8080/info``` you will get the JSON response.
