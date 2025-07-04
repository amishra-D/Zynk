const express = require('express')
const routes = express.Router()
const { getmyuser, updateuser } = require('../controllers/Authcontrollers')

routes.get('/getmyuser', getmyuser)
routes.put('/updateuser', updateuser)

module.exports = routes;
