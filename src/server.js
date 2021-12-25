import express from "express";
// import { WebSocketServer } from "ws";
import SocketIO from "socket.io";
import http from "http";

const app = express();
const PORT = 3000;

app.set("view engine", "pug");
app.set("views", __dirname + "/views");

app.use("/public", express.static("public"));

app.get("/", (req, res) => res.render("home.pug"));
app.get("/*", (req, res) => res.redirect("/")); //catchall url,, 이외의 url은 모두 홈으로

const handleListen = () => {
  console.log(`Listening on port http://localhost:${PORT}`);
};

// app.listen(PORT, handleListen); //http만 돌릴때

const httpServer = http.createServer(app); //http서버에 접근

const wsServer = SocketIO(httpServer);

wsServer.on("connection", (socket) => {
  socket.onAny((event) => {
    console.log(`Socket Event:${event}`); //이벤트명 출력..middleware와 비슷
  });
  //event이름은 작위적임 , socket.on(evnet, (msg, cb))
  socket.on("enterRoom", (roomName, showRoomCb) => {
    // console.log(roomName); //백엔드
    socket.join(roomName); //roomName의 이름을 갖는 room 생성
    console.log(socket.rooms); //어디 room에 있는지 log
    showRoomCb(); //프론트에서 작동
    socket.to(roomName).emit("welcome"); //자신을 제외하고 메시지전송
  });
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) => socket.to(room).emit("bye"));
  });
  socket.on("newMessage", (msg, room, cb) => {
    socket.to(room).emit("newMessage", msg);
    cb();
  });
});

httpServer.listen(PORT, handleListen);
