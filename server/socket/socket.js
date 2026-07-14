const redisClient = require("../config/redisconfig");

module.exports = (io) => {

   io.on("connection", (socket) => {
  console.log("New user connected", socket.id);

  socket.on("join-room", async ({ username, roomId, userId }) => {
  socket.roomId = roomId;
  socket.join(roomId);
  socket.username = username;
  socket.userId = userId;

  console.log(`${username} joined room ${roomId}`);
  const cachedMessages = await redisClient.lRange(`chat:${roomId}`, 0, -1);
  const parsedMessages = cachedMessages.map(msg => JSON.parse(msg));
  socket.emit("chat-history", parsedMessages);

  socket.to(roomId).emit("user-joined", { socketId: socket.id });
});

socket.on("chat-message", async (msg) => {
  const { roomId, sender, text, timestamp } = msg;
  const chatMessage = {
    sender,
    text,
    timestamp: timestamp || new Date().toISOString(),
  };
  await redisClient.rPush(`chat:${roomId}`, JSON.stringify(chatMessage));
  io.to(roomId).emit("chat-message", chatMessage);
});

  socket.on("offer", ({ offer, to, roomId }) => {
    io.to(to).emit("offer", { offer, from: socket.id, roomId });
  });

  socket.on("answer", ({ answer, to, roomId }) => {
    io.to(to).emit("answer", { answer, from: socket.id, roomId });
  });

  socket.on("ice-candidate", ({ candidate, roomId }) => {
    socket.to(roomId).emit("ice-candidate", { candidate, from: socket.id });
  });

  socket.on("disconnect", async () => {
  if (socket.roomId) {
    socket.to(socket.roomId).emit("user-left", { socketId: socket.id });

    const sockets = await io.in(socket.roomId).allSockets();
    if (sockets.size === 0) {
      console.log(`All users left room ${socket.roomId}. Deleting chat...`);
      await redisClient.del(`chat:${socket.roomId}`);
    }
  }
  console.log("User disconnected:", socket.id);
});

});

};