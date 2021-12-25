const socket = io(); //백엔드와 소켓 연결

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

let roomName = "";

room.hidden = true; //처음에 room을 숨김

const paintMessage = (message) => {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.append(li);
};

//입장하면 showRoom
const showRoom = () => {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName}`;
};

const handleRoomSubmit = (event) => {
  event.preventDefault();
  const input = form.querySelector("input");
  //socket.emit(event, obj, or variables.., cb)
  socket.emit("enterRoom", input.value, showRoom); //websocket에서는 socket.send()였음. event이름은 작위적
  roomName = input.value;
  input.value = "";
};

form.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", () => {
  paintMessage("Someone joined");
});
