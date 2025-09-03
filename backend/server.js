// server.js
const http = require("http");
const { Server } = require("socket.io");

const httpServer = http.createServer();
const io = new Server(httpServer, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  console.log("user connected", socket.id);

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log(`${socket.id} joined room ${roomId}`);
  });

  socket.on("video-event", ({ roomId, action, time }) => {
    socket.to(roomId).emit("video-event", { action, time });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
});

httpServer.listen(4000, () => console.log("Server on http://localhost:4000"));
