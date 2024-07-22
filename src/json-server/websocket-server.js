const { default: axios } = require('axios');
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', ws => {
  console.log('Client connected');

  ws.on('message', function (message) {
    message = JSON.parse(message)
    console.log(message)
    switch (message.type) {
        case 'message':
            broadcastMessage(message)
            break;
        case 'connection':
            broadcastMessage(message)
            break;
        case 'meeting':
            getMeetings()
            break;
        case 'dataUpdated': // Добавьте этот случай, чтобы запускать getMeetings при обновлении данных
            getMeetings()
            break;
        default:
            break;
    }
})

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log('WebSocket server is running on ws://localhost:8080');

function broadcastMessage(message) {
  console.log('отправлен всем')
  wss.clients.forEach(client => {
      client.send(JSON.stringify(message))
  })
}

function getMeetings() { 
  console.log('запрос получен')
  axios.get('http://localhost:3001/meetings')
    .then(response => {
      const meetings = response.data;
      const responseMessage = {
        type: 'meetings',
        meetings: meetings,
      };
      broadcastMessage(responseMessage);
    })
    .catch(error => {
      console.log(error);
      const responseMessage = {
        type: 'error',
        message: error.message,
      };
      broadcastMessage(responseMessage);
    });
}