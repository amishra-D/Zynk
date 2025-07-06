const express = require('express')
const routes = express.Router()
const { createroom, addparticipant, validateroom, endcall } = require('../controllers/Roomcontrollers')

routes.post('/createroom', createroom)
routes.put('/addparticipant', addparticipant)
routes.get('/validateroom/:roomId', validateroom)
routes.put('/endcall',endcall)
module.exports = routes