const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/client.html');
});

io.on('connection', (socket) => {
  let username = "anonymous";

  socket.on('chat message', ({username, msg}) => {
    console.log('message: ' + msg);
    io.emit('chat message', {username, msg});
  });
  
  socket.on('register username', newUsername => {
    // send to all clients but the sender
    socket.broadcast.emit(`${newUsername} connected`, `${newUsername}`);
    username = newUsername;
  });

  socket.on('get connect counter', () => {
    io.emit('get connect counter', connectCounter)
  })

  socket.on('disconnect', () => {
    console.log(`${username} disconnected`);
    io.emit('disconnected', username);
    socket.emit('set connect counter', 'leave');
  });
});

server.listen(3000, () => {
  const envUrl = 'http://localhost:3000'
  console.log(`listening on ${envUrl}`);
});