const express = require('express')
const routes = express.Router()
const { signup, login, logout, sendotp } = require('../controllers/Authcontrollers')
routes.post('/sendotp',sendotp)
routes.post('/signup', signup)
routes.post('/login', login)
routes.get('/logout', logout)
module.exports = routes