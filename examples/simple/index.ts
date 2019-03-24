import { createServer } from "http2-http1-server";
import * as http2 from "http2";
import { readFileSync } from "fs";

const cert = readFileSync('./ssl_certs/server.crt');
const key  = readFileSync('./ssl_certs/server.key');

const handler = (req: http2.Http2ServerRequest, res: http2.Http2ServerResponse) => {
  res.end("hello from server!");
};

// [IMPORTANT] You can use the same handler!
const server       = createServer({}, handler);
const secureServer = http2.createSecureServer({cert, key}, handler);

server.listen(8080);
secureServer.listen(8443);
