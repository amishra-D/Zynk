const express=require('express')
const http=require('http')
const cors = require('cors');
const { Server } = require('socket.io');
require('dotenv').config();
const dbconnect=require('./config/dbconfig.js')
const authroutes=require('./routes/Authroutes')
const profileroutes=require('./routes/Profileroutes')
const AuthMiddleware=require('./middlewares/Authmiddleware')
const roomroutes=require('./routes/Roomroutes')
const app=express();
app.use(cors({ origin: process.env.CLIENT_URL,credentials: true, methods: ['GET', 'POST','PUT'] }));
const server=http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true
  }
});
const cookieParser = require('cookie-parser');
const redisClient = require('./config/redisconfig.js');
app.use(cookieParser());
app.use(express.json());
dbconnect();

const port = process.env.PORT || 3000;
app.get('/',(req,res)=>{
    res.send('HAHA')
})

app.use('/api/auth',authroutes);
app.use('/api/profile',AuthMiddleware,profileroutes);
app.use('/api/room',AuthMiddleware,roomroutes);

server.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})

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