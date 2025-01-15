const http = require("http");
const express = require("express");

const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

io.on("connection", (socket) => {
  console.log("A new user has connected", socket.id);
  socket.on("chat-message", (message) => {
    io.emit("add-message", message);
  });
});

app.use(express.static("/public"));

app.get("/", (req, res) => {
  return res.sendFile(__dirname + "/public/index.html");
});

server.listen(8000, () => {
  console.log("Server started at 8000");
});
