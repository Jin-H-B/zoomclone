//프론트에서 백엔드로의 연결 소켓
const socket = new WebSocket(`ws://${window.location.host}`); //모바일에서도 가능하도록 주소를 window.location.host로 명시
//셀렉터
const msgList = document.querySelector("ul");
const msgForm = document.querySelector("#message");
const nickForm = document.querySelector("#nick");

//메시지 오브젝트를 stringify..socket.send()로 서버에 보낼때 string으로 보내야 서버 언어 관계 없이 작동
const makeMessage = (type, payload) => {
  const msg = { type, payload };
  return JSON.stringify(msg);
};

//백엔드에서 connection socket한 것을 프론트에서 다음과 같이 받음
socket.addEventListener("open", () => {
  console.log("Connected to Server✅");
});

socket.addEventListener("message", (message) => {
  console.log("Message from the Server:", message.data);
  const li = document.createElement("li");
  li.innerText = message.data;
  msgList.append(li);
});

socket.addEventListener("close", () => {
  console.log("Disconnected from the server🟥");
});

// setTimeout(() => {
//   socket.send("hello, this is Browser");
// }, 5000);

const handleMsgSubmit = (event) => {
  event.preventDefault();
  const input = msgForm.querySelector("input");
  //input의 value를 socket을 통해 백엔드로 보냄
  socket.send(makeMessage("newMessage", input.value));
  input.value = ""; //input값 초기화
};

const handleNickSubmit = (event) => {
  event.preventDefault();
  const input = nickForm.querySelector("input");
  socket.send(makeMessage("nickname", input.value));
};

msgForm.addEventListener("submit", handleMsgSubmit);
nickForm.addEventListener("submit", handleNickSubmit);
