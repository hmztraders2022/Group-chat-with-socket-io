// BASIC SOCKET IO

const express = require("express");
const { createServer } = require("node:http")
const { join } = require("node:path");
const { Server } = require("socket.io")

const app = express();
const server = createServer(app);
const io = new Server(server);

app.static()

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
})

io.on("connection", (socket) => {
  console.log(socket.id, "id")
  socket.on('chat_message', (msg) => {
    io.emit('chat_message', msg);
  });
  socket.on("disconnect", () => {
    console.log("User Disconnected")
  })
})

server.listen(3000, () => {
  console.log("Server berjalan aman")
})