require('dotenv').config();
const app=require("./app");
const dbconnect=require('./config/dbconfig.js')
const redisClient = require('./config/redisconfig.js');

const http=require('http')
const { Server } = require('socket.io');
dbconnect();
const server=http.createServer(app);
const clientUrl = process.env.CLIENT_URL ? process.env.CLIENT_URL.replace(/\/$/, "") : "";
const io = new Server(server, {
  cors: {
    origin: clientUrl,
    methods: ["GET", "POST"],
    credentials: true
  }
});
require("./socket/socket")(io);
const port = process.env.PORT || 5000;
server.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})