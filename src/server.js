import express from "express";
import { WebSocketServer } from "ws";
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

//fake DB
const sockets = [];

//백엔드에서 프론트엔드로의 연결 소켓
wss.on("connection", (socket) => {
  sockets.push(socket); //각 소켓들을 DB에 저장
  socket["nickname"] = "Anon"; //소켓은 객체이므로 key value 추가 가능.
  console.log("Connected to Browser✅");
  //   socket.send("hello"); //socket으로 data전송, 프론트 소켓에서 데이터 받도록 설정
  socket.on("close", () => console.log("Disconnected with the Browser❌"));
  socket.on("message", (message) => {
    // console.log("Message from the Browser:", message.toString("utf8"));
    const parsed = JSON.parse(message.toString("utf-8"));
    // console.log(parsed, message, message.toString("utf-8"));
    //if문 대신 switch문 사용(더 정돈돼 보이기 위해)
    switch (parsed.type) {
      case "newMessage":
        //소켓 DB안의 각 브라우저에 대해
        sockets.forEach((aSocket) => {
          aSocket.send(`${socket.nickname}:${parsed.payload}`); //닉네임에 socket에 담겨있는 nickname 값을 넣고 브라우저로 메시지 전송
        });
        break;
      case "nickname":
        // console.log(parsed.payload);
        socket["nickname"] = parsed.payload; //socket은 객체이므로 key value 추가가 가능
        break;
    }
  });
});

server.listen(PORT, handleListen);
