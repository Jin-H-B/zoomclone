//프론트에서 백엔드로의 연결 소켓
const socket = new WebSocket(`ws://${window.location.host}`); //모바일에서도 가능하도록 주소를 window.location.host로 명시
//셀렉터
const msgList = document.querySelector("ul");
const msgForm = document.querySelector("form");

//백엔드에서 connection socket한 것을 프론트에서 다음과 같이 받음
socket.addEventListener("open", () => {
  console.log("Connected to Server✅");
});

socket.addEventListener("message", (message) => {
  console.log("Message from the Server:", message.data);
});

socket.addEventListener("close", () => {
  console.log("Disconnected from the server🟥");
});

// setTimeout(() => {
//   socket.send("hello, this is Browser");
// }, 5000);

const handleSubmit = (event) => {
  event.preventDefault();
  const input = msgForm.querySelector("input");
  //input의 value를 socket을 통해 백엔드로 보냄
  socket.send(input.value);
  input.value = ""; //input값 초기화
};

msgForm.addEventListener("submit", handleSubmit);
