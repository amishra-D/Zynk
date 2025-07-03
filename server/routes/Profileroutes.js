const express=require('express')
const routes=express.Router()
const{getmyuser}=require('../controllers/Authcontrollers')

routes.get('/getmyuser',getmyuser)
module.exports=routes;
