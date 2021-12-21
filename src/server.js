import express from "express";
import WebSocket, { WebSocketServer } from "ws";
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

const server = http.createServer(app); //http서버에 접근
const wss = new WebSocketServer({ server }); //http 서버 위에 웹소켓서버를 같이 돌림

//백엔드에서 프론트엔드로의 연결 소켓
wss.on("connection", (socket) => {
  console.log("Connected to Browser✅");
  socket.send("hello"); //socket으로 data전송, 프론트 소켓에서 데이터 받도록 설정
  socket.on("close", () => console.log("Disconnected with the Browser❌"));
  socket.on("message", (message) =>
    console.log("Message from the Browser:", message.toString("utf8"))
  );
});

server.listen(PORT, handleListen);
