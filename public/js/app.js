const socket = io(); //백엔드와 소켓 연결

const welcome = document.getElementById("welcome");
const roomNameForm = welcome.querySelector("#roomName");
const room = document.getElementById("room");
const nicknameForm = welcome.querySelector("#nickname");

let roomName = "";

room.hidden = true; //처음에 room을 숨김

const paintMessage = (message) => {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.append(li);
};

const handleMessageSubmit = (event) => {
  event.preventDefault();
  const input = room.querySelector("#msg input");
  socket.emit("newMessage", input.value, roomName, () => {
    paintMessage(`You: ${input.value}`); //이부분이 있어야 자신도 메시지 볼 수 있음
    input.value = "";
  });
};

const handleNameSubmit = (event) => {
  event.preventDefault();
  const input = welcome.querySelector("#nickname input");
  socket.emit("nickname", input.value);
};

//입장하면 showRoom
const showRoom = () => {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName}`;
  //message기능
  const msgForm = room.querySelector("#msg");

  msgForm.addEventListener("submit", handleMessageSubmit);
};

const handleRoomSubmit = (event) => {
  event.preventDefault();
  const input = welcome.querySelector("#roomName input");
  //socket.emit(event, obj, or variables.., cb)
  socket.emit("enterRoom", input.value, showRoom); //websocket에서는 socket.send()였음. event이름은 작위적
  roomName = input.value;
  input.value = "";
};

roomNameForm.addEventListener("submit", handleRoomSubmit);

nicknameForm.addEventListener("submit", handleNameSubmit);

socket.on("welcome", (user) => {
  paintMessage(`${user} joined`);
});

socket.on("bye", (user) => {
  paintMessage(`${user} left`);
});

socket.on("newMessage", (message) => {
  paintMessage(message);
});

socket.on("roomChange", (rooms) => {
  const roomList = welcome.querySelector("ul");
  roomList.innerText = ""; //룸 리스트를 우선 초기화
  //다시 현재 열려있는 public rooms 리스트에 대해 paint(disconnect 된 room은 리스트에서 빠짐)
  rooms.forEach((room) => {
    const li = document.createElement("li");
    li.innerText = room;
    roomList.append(li);
  });
});
