const express = require('express');
const app = express();
const server = require('http').createServer(app);;
const io = require('socket.io')(server);
const port = 6969;



io.sockets.on('connection', (socket) => {
  console.log('Connection', socket.id);
  

  socket.on('getId', async(_) => {
    socket.emit('socketId', socket.id);
  });



  socket.on('join', data => {
    const room = data.room;
    socket.join(room);
    const clientsLength = io.nsps['/'].adapter.rooms[room].length;
    if(clientsLength > 0) {
      io.sockets.to(room).emit('newUser', {message: `${data.username} has joined the chat..`, joined: true, joiners: clientsLength});
      socket.emit('newUser', {message: `Welcome to this chat room.. ${data.username}`, joined: true, joiners: clientsLength});
    } else {
      socket.emit('newUser', {joined: false});
    }
  }); 


});



  server.listen(process.env.PORT || port, () => {
    console.log('Server started and connected to port: '+port);
  });
