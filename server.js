const { Socket } = require('dgram');
const express = require('express');
const app = express();
const server = require('http').createServer(app);;
const io = require('socket.io')(server);
const path = require("path");
const port = 6969;



io.sockets.on('connection', (socket) => {
  console.log('Connection', socket.id);
  
//from client to controller
  socket.on('getId', async(_) => {
    console.log('get id');
    socket.emit('socketId', socket.id);
  });

  //from controller to client
  socket.on("sendInstruction", (data) => {
    console.log(data);
    socket.to(data.id).emit("instruction", {inst: data.inst, id: socket.id});
  });

  //from client to controller
  socket.on("confirmId", data => {
    let confirmed = false;
    var sockets = io.sockets.clients();
    const index = Object.keys(sockets.sockets).filter(sId => sId == data.id);
    console.log(index);
    if(index.length == 0) confirmed = false;
    else confirmed = true;

    socket.emit("confirmed", {confirmed});
  });

  //from client to controller
  socket.on("status", data => {
    socket.to(data.id).emit("status", {status: data.status});
  });

  //from client to controller and from controller to client
  socket.on("zoom", (data) => {
    socket.to(data.id).emit("zoom", {zoomValue: data.zoomValue});
  });

});

app.use('/public', express.static('./public/'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
})


  server.listen(process.env.PORT || port, () => {
    console.log('Server started and connected to port: '+port);
  });
