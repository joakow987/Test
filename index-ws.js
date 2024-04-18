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

process.on('SIGINT', () => {
  wss.clients.forEach((client) => {
    client.close();
  });
  server.close(() => shutDownDb());
});

// Being a WebSocket

const WebSocketServer = require('ws').Server;
const wss = new WebSocketServer({ server });
wss.on('connection', function connection(ws) {
  const numClients = wss.clients.size;
  console.log('Connected clients:', numClients);

  wss.broadcast(`Connected clients: ${numClients}`);

  if (ws.readyState === ws.OPEN) {
    ws.send('Welcome to my server');
  }

  db.run(
    `INSERT INTO visitors (count, time) VALUES (${numClients}, datetime('now'))`,
  );

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

// End WebSockets

// Begin db
const sqlite = require('sqlite3');
const db = new sqlite.Database(':memory:');

db.serialize(() => {
  db.run(`
    CREATE TABLE visitors (count INTEGER, time TEXT)`);
});

function getCounts() {
  db.each('SELECT * FROM visitors', (error, row) => {
    console.log('row', row);
  });
}

function shutDownDb() {
  getCounts();
  console.log('Shutting down db...');
  db.close();
}
