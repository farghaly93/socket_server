const io = require("socket.io");
  const socket = io();
  var socketId;
  function getSocketId(e) {
    if(e.keyCode == 13) {
      socketId = e.target.value;
      if(socketId != null) {
        document.getElementById("sending").setAttribute("style", "display: none");
        document.getElementById("buttons").style.display = "flex";
      }
    }
  }
  function sendInstruction(inst) {
    console.log(inst);
    socket.emit("sendInstruction", {id: socketId, inst});
  }
  function createButton() {
      var buttons = "";
      buttons += new Button("Record", "sendInstruction('record')").button();
      buttons += new Button("Stop", "sendInstruction('stop')").button();
      buttons += new Button("Zoom in", "sendInstruction('zoomIn')").button();
      buttons += new Button("Zoom out", "sendInstruction('zoomOut')").button();
      buttons += new Button("Switch camera", "sendInstruction('switchCamera')").button();
      return buttons;
    }
  window.onload = () => {
    document.getElementById("buttons").innerHTML = createButton();
  }

  class Button {
    constructor(name, func) {
      this.name = name;
      this.func = func;
    }
    button() {
      return '<div onclick="'+this.func+'" class="button">'+
                '<h1>'+this.name+'</h1>'+
             '</div>';
    }  
  }
