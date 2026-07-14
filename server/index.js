const app=require("./app");
const dbconnect=require('./config/dbconfig.js')
const redisClient = require('./config/redisconfig.js');

const http=require('http')
const { Server } = require('socket.io');
require('dotenv').config();
dbconnect();
const server=http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true
  }
});
require("./socket/socket")(io);
const port = process.env.PORT || 5000;
server.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})