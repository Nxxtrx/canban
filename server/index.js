const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const jsonServer = require('json-server');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const router = jsonServer.router('./src/json-server/data.json');
const middlewares = jsonServer.defaults();

app.use(middlewares);
app.use(router);

app.use(express.json());
app.post('/notify', (req, res) => {
  io.emit('dataUpdated');
  res.sendStatus(200);
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket.on('fetchMeetings', async () => {
    try {
      const response = await axios.get('http://localhost:3001/meetings');
      socket.emit('meetings', response.data);
    } catch (error) {
      socket.emit('error', error.message);
    }
  });
});

server.listen(3002, () => {
  console.log('listening on *:3002');
});

const jsonServerApp = jsonServer.create();
jsonServerApp.use(middlewares);
jsonServerApp.use(router);

jsonServerApp.listen(3001, () => {
  console.log('JSON Server is running on http://localhost:3001');
});