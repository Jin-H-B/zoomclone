"use strict";

var _express = _interopRequireDefault(require("express"));

var _socket = _interopRequireDefault(require("socket.io"));

var _http = _interopRequireDefault(require("http"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express["default"])();
var PORT = 3000;
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views"); //process.cwd()는 node명령 호출한 작업 dir의 절대경로

app.use("/public", _express["default"]["static"](__dirname + "/public")); //__dirname은 실행파일의 절대경로

app.use("/assets", _express["default"]["static"]("assets"));
app.get("/", function (req, res) {
  return res.render("home.pug");
});
app.get("/*", function (req, res) {
  return res.redirect("/");
}); //catchall url,, 이외의 url은 모두 홈으로

var handleListen = function handleListen() {
  console.log("Listening on port http://localhost:".concat(PORT));
}; // app.listen(PORT, handleListen); //http만 돌릴때


var httpServer = _http["default"].createServer(app); //http서버에 접근


var wsServer = (0, _socket["default"])(httpServer);
wsServer.on("connection", function (socket) {
  socket.on("join_room", function (roomName) {
    socket.join(roomName);
    socket.to(roomName).emit("welcome");
  });
  socket.on("offer", function (offer, roomName) {
    socket.to(roomName).emit("offer", offer);
  });
  socket.on("answer", function (answer, roomName) {
    socket.to(roomName).emit("answer", answer);
  });
  socket.on("ice", function (ice, roomName) {
    socket.to(roomName).emit("ice", ice);
  });
});
httpServer.listen(PORT, handleListen);