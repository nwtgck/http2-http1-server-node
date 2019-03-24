# http2-http1-server

HTTP/2-interface HTTP1 server for compatibility for Node.js/TypeScript

## Purpose

The purpose of this project is for compatibility to support HTTP/1 clients over non-TLS in Node.js/TypeScript.

Unfortunately [current type definitions](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/a642ee239c2992dd1ca45a1a0baeaa4169f374cd) of [HTTP/2 Compatible API](https://nodejs.org/api/http2.html#http2_compatibility_api) is not compatible like the following. The handler types are different.

```ts
// http
function createServer(options: ServerOptions, requestListener?: (req: IncomingMessage, res: ServerResponse) => void): Server;
```

```ts
// http2
export function createServer(options: ServerOptions, onRequestHandler?: (request: Http2ServerRequest, response: Http2ServerResponse) => void): Http2Server;
```

So, Node.js developers in TypeScript should **implement two different types of handlers** to support both HTTP/1 and HTTP/2 over non-TLS.
To solve the annoying issue, this project provides HTTP/1 server whose interface is the same as `http2.createServer()`. This project allows you to implement only one handler(= `(request: Http2ServerRequest, response: Http2ServerResponse) => void`).
