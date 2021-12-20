import express from "express";

const app = express();
const PORT = 3000;

app.set("view engine", "pug");
app.set("views", __dirname + "/views");

app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => res.render("home.pug"));
app.get("/*", (req, res) => res.redirect("/")); //catchall url,, 이외의 url은 모두 홈으로

const handleListen = () => {
  console.log(`Listening on port http://localhost:${PORT}`);
};

app.listen(PORT, handleListen);
