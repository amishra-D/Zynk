const express = require('express')
const routes = express.Router()
const { createroom, addparticipant } = require('../controllers/Roomcontrollers')

routes.post('/createroom', createroom)
routes.put('/addparticipant', addparticipant)
module.exports = routes