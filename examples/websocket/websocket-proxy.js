/*
  web-socket-proxy.js: Example of proxying over HTTP and WebSockets.

  Copyright (c) 2013 - 2016 Charlie Robbins, Jarrett Cruger & the Contributors.

  Permission is hereby granted, free of charge, to any person obtaining
  a copy of this software and associated documentation files (the
  "Software"), to deal in the Software without restriction, including
  without limitation the rights to use, copy, modify, merge, publish,
  distribute, sublicense, and/or sell copies of the Software, and to
  permit persons to whom the Software is furnished to do so, subject to
  the following conditions:

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
  LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
  OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
  WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/

var util = require('util'),
    http = require('http'),
    colors = require('colors'),
    httpProxy = require('../../lib/http-proxy');

try {
  var io = require('socket.io'),
      client = require('socket.io-client');
}
catch (ex) {
  console.error('Socket.io is required for this example:');
  console.error('npm ' + 'install'.green);
  process.exit(1);
}

//
// Create the target HTTP server and setup
// socket.io on it.
//
var server = io.listen(9014);
server.sockets.on('connection', function (client) {
  util.debug('Got websocket connection');

  client.on('message', function (msg) {
    util.debug('Got message from client: ' + msg);
  });

  client.send('from server');
});

//
// Create a proxy server with node-http-proxy
//
httpProxy.createServer({ target: 'wss://bonk.io/socket.io/', ws: true }).listen(8014);

//
// Setup the socket.io client against our proxy
//
var ws = client.connect('ws://localhost:8014');

ws.on('message', function (msg) {
  util.debug('Got message: ' + msg);
  ws.send('I am the client');
});
