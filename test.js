const io = require("socket.io-client");

const socket = io("http://localhost:3000");

socket.on("connect", () => {
  console.log("Connected to the server with ID:", socket.id);
});

socket.on("post", (data) => {
  console.log("Received new post event:", data);
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});
