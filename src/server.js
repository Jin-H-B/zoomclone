import express from "express";
import SocketIO from "socket.io";
import http from "http";

const app = express();
const PORT = process.env.PORT || 3000; //heroku는 process.env.PORT로

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views"); //process.cwd()는 node명령 호출한 작업 dir의 절대경로

app.use("/public", express.static(__dirname + "/public")); //__dirname은 실행파일의 절대경로
app.use("/assets", express.static("assets"));

app.get("/", (req, res) => res.render("home.pug"));
app.get("/*", (req, res) => res.redirect("/")); //catchall url,, 이외의 url은 모두 홈으로

const handleListen = () => {
  console.log(`Listening on port http://localhost:${PORT}`);
};

// app.listen(PORT, handleListen); //http만 돌릴때

const httpServer = http.createServer(app); //http서버에 접근
const wsServer = SocketIO(httpServer);

wsServer.on("connection", (socket) => {
  socket.on("join_room", (roomName) => {
    socket.join(roomName);

    socket.to(roomName).emit("welcome");
  });
  socket.on("offer", (offer, roomName) => {
    socket.to(roomName).emit("offer", offer);
  });
  socket.on("answer", (answer, roomName) => {
    socket.to(roomName).emit("answer", answer);
  });
  socket.on("ice", (ice, roomName) => {
    socket.to(roomName).emit("ice", ice);
  });
});

httpServer.listen(PORT, handleListen);
