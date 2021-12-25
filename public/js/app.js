const socket = io(); //백엔드와 소켓 연결

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");

const handleRoomSubmit = (event) => {
  event.preventDefault();
  const input = form.querySelector("input");
  //socket.emit(event, obj, cb)
  socket.emit("enterRoom", { payload: input.value }, () => {
    console.log("server is done");
  }); //websocket에서는 socket.send()였음. event이름은 작위적
  input.value = "";
};

form.addEventListener("submit", handleRoomSubmit);
