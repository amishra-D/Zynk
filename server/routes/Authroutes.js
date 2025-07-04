const express = require('express')
const routes = express.Router()
const { signup, login, logout, getmyuser } = require('../controllers/Authcontrollers')

routes.post('/signup', signup)
routes.post('/login', login)
routes.get('/logout', logout)
module.exports = routes