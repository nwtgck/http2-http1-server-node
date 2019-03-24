export function hoge(str: string): number {
  return str.length;
}

// TODO: Use import instead of require

const http2 = require("http2");
const http = require("http");

const net = require("net");

const { kIncomingMessage } = require('_http_common');
const { kServerResponse } = require('_http_server');


// (from:  https://github.com/nodejs/node/blob/296712602b4cba785ccda72623c0cbe3b4584abb/lib/internal/http2/core.js#L2610
const kOptions = Symbol('options');

const kDefaultSocketTimeout = 2 * 60 * 1000;

const { _connectionListener: httpConnectionListener } = http;


// TODO: Not use any
// (base: https://github.com/nodejs/node/blob/296712602b4cba785ccda72623c0cbe3b4584abb/lib/internal/http2/compat.js#L738
function onServerStream(ServerRequest: any, ServerResponse: any,
                        stream: any, headers: any, flags: any, rawHeaders: any) {
  const server = this;
  const request = new ServerRequest(stream, headers, undefined, rawHeaders);
  const response = new ServerResponse(stream);

  // Check for the CONNECT method
  const method = headers[http2.constants.HTTP2_HEADER_METHOD];
  if (method === 'CONNECT') {
    if (!server.emit('connect', request, response)) {
      response.statusCode = http2.constants.HTTP_STATUS_METHOD_NOT_ALLOWED;
      response.end();
    }
    return;
  }

  // Check for Expectations
  if (headers.expect !== undefined) {
    if (headers.expect === '100-continue') {
      if (server.listenerCount('checkContinue')) {
        server.emit('checkContinue', request, response);
      } else {
        response.writeContinue();
        server.emit('request', request, response);
      }
    } else if (server.listenerCount('checkExpectation')) {
      server.emit('checkExpectation', request, response);
    } else {
      response.statusCode = http2.constants.HTTP_STATUS_EXPECTATION_FAILED;
      response.end();
    }
    return;
  }

  server.emit('request', request, response);
}

// TODO: Not use any
function setupCompat(ev: any) {
  if (ev === 'request') {
    (this as any).removeListener('newListener', setupCompat);
    (this as any).on('stream', onServerStream.bind(
      (this as any),
      (this as any)[kOptions].Http2ServerRequest,
      (this as any)[kOptions].Http2ServerResponse)
    );
  }
}

// TODO: Not use any
function initializeOptions(options: any) {
  // assertIsObject(options, 'options');
  options = { ...options };
  options.allowHalfOpen = true;
  // assertIsObject(options.settings, 'options.settings');
  options.settings = { ...options.settings };

  // Used only with allowHTTP1
  options.Http1IncomingMessage = options.Http1IncomingMessage ||
      http.IncomingMessage;
  options.Http1ServerResponse = options.Http1ServerResponse ||
      http.ServerResponse;

  options.Http2ServerRequest = options.Http2ServerRequest ||
      http2.Http2ServerRequest;
  options.Http2ServerResponse = options.Http2ServerResponse ||
      http2.Http2ServerResponse;
  return options;
}


// TODO: Not use any
function connectionListener(socket: any) {
  console.log("connectionListener called");
  const options = this[kOptions] || {};
  socket.server[kIncomingMessage] = options.Http1IncomingMessage;
  socket.server[kServerResponse] = options.Http1ServerResponse;
  return httpConnectionListener.call(this, socket);
}

export class Http2Http1Server extends net.Server {
  // TODO: Not use any
  constructor(options: any, requestListener: any) {
    super(connectionListener);
    (this as any)[kOptions] = initializeOptions(options);
    this.timeout = kDefaultSocketTimeout;
    this.on('newListener', setupCompat);
    if (typeof requestListener === 'function')
      this.on('request', requestListener);
  }

  // TODO: Not use any
  setTimeout(msecs: any, callback: any) {
    this.timeout = msecs;
    if (callback !== undefined) {
      if (typeof callback !== 'function')
        // TODO: Use it
        // throw new ERR_INVALID_CALLBACK();
        throw new Error("Invalid Callback (Should use new ERR_INVALID_CALLBACK() but it's internal)");
      this.on('timeout', callback);
    }
    return this;
  }
}

// TODO: Not use any
export function createServer(options: any, handler: any) {
  if (typeof options === 'function') {
    handler = options;
    options = {};
  }
  // assertIsObject(options, 'options');
  return new Http2Http1Server(options, handler);
}
