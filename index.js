const express = require("express");
const { createServer } = require("node:http")
const { join } = require("node:path");
const { Server } = require("socket.io")

const app = express();
const server = createServer(app);
const io = new Server(server);
let socketConnected = new Set();

app.use(express.static(join(__dirname, 'public')))

io.on("connection", onConnected);

function onConnected(socket) {
  console.log(socket.id, "sokcet")
  socketConnected.add(socket.id);

  io.emit("clients-total", socketConnected.size)

  socket.on("disconnect", () => {
    console.log('Socket disconnected', socket.id);
    socketConnected.delete(socket.id);
  })

  socket.on('message', (data) => {
    socket.broadcast.emit('chat-message', data)
  })

  socket.on('feedback', (data) => {
    socket.broadcast.emit('feedback', data)
  })
}


server.listen(3000, () => {
  console.log("Server berjalan aman")
})