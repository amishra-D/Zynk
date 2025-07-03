const express=require('express')
const http=require('http')
const cors = require('cors');
const { Server } = require('socket.io');
require('dotenv').config();
const dbconnect=require('./config/dbconfig.js')
const authroutes=require('./routes/Authroutes')
const profileroutes=require('./routes/Profileroutes')
const AuthMiddleware=require('./middlewares/Authmiddleware')

const app=express();
app.use(cors({ origin: 'http://localhost:5173',credentials: true, methods: ['GET', 'POST','PUT'] }));
const server=http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(express.json());
dbconnect();

const port = process.env.PORT || 3000;
app.get('/',(req,res)=>{
    res.send('HAHA')
})

app.use('/api/auth',authroutes);
app.use('/api/profile',AuthMiddleware,profileroutes);

server.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})

io.on("connection", (socket) => {
  console.log("New user connected", socket.id);

  socket.on("join-room", async ({ username, roomId,userId }) => {
    socket.roomId = roomId;
    socket.join(roomId);
    socket.username = username;
    socket.userId = userId;
    console.log(`${socket.username} joined room ${roomId}`);
    socket.to(roomId).emit("user-joined", { socketId: socket.id });
    console.log(`${socket.id} joined room ${roomId}`);
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

  socket.on("disconnect", () => {
    if (socket.roomId) {
      socket.to(socket.roomId).emit("user-left", { socketId: socket.id });
    }
    console.log("User disconnected:", socket.id);
  });
});