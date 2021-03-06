import * as http2 from "http2";
import thenRequest from "then-request";
import * as assert from 'power-assert';
import * as getPort from "get-port";

import {createServer}  from '../lib/http2-http1-server';

// Sleep
// (from: https://qiita.com/yuba/items/2b17f9ac188e5138319c)
export function sleep(ms: number): Promise<any> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe('createServer', () => {
  it("should allow HTTP/1 client to connect", async ()=>{
    const port: number = await getPort();

    const server = createServer({}, (req: http2.Http2ServerRequest, res: http2.Http2ServerResponse)=>{
      res.end("hello from server!\n");
    });

    server.listen(port);

    await sleep(10);

    const res1 = await thenRequest("GET", `http://localhost:${port}`);
    assert.strictEqual(res1.statusCode, 200);
    assert.strictEqual(res1.getBody("UTF-8"), "hello from server!\n");

    server.close();
  });
});
