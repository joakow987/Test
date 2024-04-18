const express = require('express');
const server = require('http').createServer();
const app = express();

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: __dirname });
});

server.on('request', app);

server.listen(3002, () => {
  console.log('Server is running on port 3002');
});

// Being a WebSocket

const WebSocketServer = require('ws').Server;
const wss = new WebSocketServer({ server });
wss.on('connection', function connection(ws) {
  const numClients = wss.clients.size;
  console.log('Connected clients:', numClients);

  wss.broadcast(`Connected clients: ${numClients}`);
  wss.readyState === ws.OPEN && ws.send('Welcome to my server');

  ws.on('close', function close() {
    wss.broadcast(`Current visitors: ${numClients}`);
    console.log('A client has disconnected');
  });
});

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    client.send(data);
  });
};
