const http = require("http");
const express = require("express");

const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

io.on("connection", (socket) => {
  console.log("A new user has connected", socket.id);

  socket.on("join-room", (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room: ${room}`);
    socket
      .to(room)
      .emit("new-notification", `User ${socket.id} has joined the room.`);
  });

  socket.on("leave-room", (room) => {
    socket.leave(room);
    console.log(`User ${socket.id} left room: ${room}`);
    socket
      .to(room)
      .emit("new-notification", `User ${socket.id} has left the room.`);
  });

  socket.on("chat-message", (message, room) => {
    socket.emit("add-message", message, "self");
    socket.to(room).emit("add-message", message, "other");
    socket.to(room).emit("new-notification", `User ${socket.id}: ${message}`);
  });
});

app.use(express.static("public"));

app.get("/", (req, res) => {
  return res.sendFile(__dirname + "/public/index.html");
});

server.listen(8000, () => {
  console.log("Server started at http://localhost:8000");
});
