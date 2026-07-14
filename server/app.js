const express=require('express')
const http=require('http')
const cors = require('cors');

const authroutes=require('./routes/Authroutes')
const profileroutes=require('./routes/Profileroutes')
const AuthMiddleware=require('./middlewares/Authmiddleware')
const roomroutes=require('./routes/Roomroutes')
const app=express();
const clientUrl = process.env.CLIENT_URL ? process.env.CLIENT_URL.replace(/\/$/, "") : "";
app.use(cors({ origin: clientUrl, credentials: true, methods: ['GET', 'POST','PUT'] }));

const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(express.json());

app.get('/',(req,res)=>{
    res.send('ZYNK')
})

app.use('/api/auth',authroutes);
app.use('/api/profile',AuthMiddleware,profileroutes);
app.use('/api/room',AuthMiddleware,roomroutes);



module.exports=app;