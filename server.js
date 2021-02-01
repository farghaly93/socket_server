const express = require('express');
const app = express();
const server = require('http').createServer(app);;
const io = require('socket.io')(server);
const path = require("path");
const port = 6969;



io.sockets.on('connection', (socket) => {
  console.log('Connection', socket.id);
  

  socket.on('getId', async(_) => {
    console.log('get id');
    socket.emit('socketId', socket.id);
  });

  socket.on("sendInstruction", (data) => {
    console.log(data);
    socket.to(data.id).emit("instruction", {inst: data.inst});
  });

});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
})


  server.listen(process.env.PORT || port, () => {
    console.log('Server started and connected to port: '+port);
  });
