    const socket = io();
    var socketId;
    var timer;
    var seconds = 0;
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
      const el = document.getElementsByClassName(inst)[0];
      el.classList.add("pressed");
      setTimeout(() => el.classList.remove("pressed"), 100);
      socket.emit("sendInstruction", {id: socketId, inst});
    }

    function testSocket() {
      if(socketId != "") {
        socket.emit("confirmId", socketId);
        socket.on("confirmed", data => {
          if(!data.confirmed) {
            document.getElementsByClassName("socketId")[0].setAttribute("style", "display: none");
            document.getElementById("container").style.display = "flex";
          } else {
            document.getElementById("alert").innerHTML = "<h3 style='color: red'>there is no device connected with this ID</h3>";
          }
        });
      }
    }

    function countTime() {
      timer = setInterval(() => {
        ++seconds;
        var date = new Date(seconds*1000).toString();
        var time = date.slice(16, 24).split("");
        var hours = time[1] - 2;
        time[1] = hours;
        document.getElementById("timer").innerHTML = time.join("");
      }, 1000);
    }

    socket.on("status", data => {
      console.log("status", data);
      const btns = document.getElementsByClassName("ctrl");
      if(data.status == "started") {
        btns[0].getElementsByTagName("IMG")[0].setAttribute("src", "./public/pause.png");
        btns[1].getElementsByTagName("IMG")[0].setAttribute("src", "./public/stop.png");
        countTime();
      }
      else if(data.status == "paused") {
        btns[0].getElementsByTagName("IMG")[0].setAttribute("src", "./public/record.png");
        clearInterval(timer);
      }
      else if(data.status == "resumed") {
        btns[0].getElementsByTagName("IMG")[0].setAttribute("src", "./public/pause.png");
        countTime();
      }
      else if(data.status == "stopped") {
        btns[0].getElementsByTagName("IMG")[0].setAttribute("src", "./public/record.png");
        btns[1].getElementsByTagName("IMG")[0].setAttribute("src", "./public/stop_empty.png");
        clearInterval(timer);
        seconds = 0;
        document.getElementById("timer").innerHTML = "00:00:00";
      }
    });

    window.onload = () => {
      // document.getElementById("buttons").innerHTML = createButton();
    }

