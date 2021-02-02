    const socket = io();
    var socketId;
    function getSocketId(e) {
      if(e.keyCode == 13) {
        socketId = e.target.value;
        testSocket();
      }
    }
    function continueToControls() {
      socketId = document.getElementById("sending").value;
      testSocket();
    }
    function sendInstruction(inst) {
      socket.emit("sendInstruction", {id: socketId, inst});
    }
    function testSocket() {
      if(socketId != "") {
        socket.emit("confirmId", socketId);
        socket.on("confirmed", data => {
          if(data.confirmed) {
            document.getElementsByClassName("socketId")[0].setAttribute("style", "display: none");
            document.getElementById("buttons").style.display = "flex";
          } else {
            document.getElementById("alert").innerHTML = "<h3 style='color: red'>there is no device connected with this ID</h3>";
          }
        });
      }
    }
    socket.on("status", status => {
      const btns = document.getElementsByClassName("ctrl");
      if(status == "started") {
        btns[0].getElementsByTagName("IMG")[0].getAttribute("src") = "./public/pause.png";
      }
      else if(status == "paused") {}
      else if(status == "resumed") {}
      else if(status == "stopped") {}
    });
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
      // document.getElementById("buttons").innerHTML = createButton();
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
