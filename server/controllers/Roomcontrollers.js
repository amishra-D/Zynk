const Room = require('../models/Room');
const { createRoomSchema, endCallSchema, validateRoomSchema } = require('../utils/validaterooms');

const createroom = async (req, res) => {
    try {
        const validate = createRoomSchema.safeParse(req.body);
        if (!validate.success) {
            return res.status(400).json(validate.error);
        }
        const { roomId, participants = [], duration = 0, host } = validate.data
        const existingRoom = await Room.findOne({ roomId });
        if (existingRoom) {
            return res.status(400).json({ message: 'Room already exists' });
        }
        const room = await Room.create({ roomId, participants, duration, host });
        return res.status(200).json({ room, message: 'Room created successfully' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const addparticipant = async (req, res) => {
    try {
        const { roomId, participant } = req.body;
        const room = await Room.findOne({ roomId });
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        const alreadyExists = room.participants.includes(participant);
        if (alreadyExists) {
            return res.status(400).json({ message: 'Participant already in the room' });
        }
        room.participants.push(participant);
        await room.save();
        return res.status(200).json({ message: 'Participant added successfully', room });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};
const validateroom = async (req, res) => {
    try {
        const validate = validateRoomSchema.safeParse(req.params);
        if (!validate.success) {
            return res.status(400).json(validate.error);
        }
        const { roomId } = validate.data;
console.log('Incoming roomId:', roomId);

const room = await Room.findOne({ roomId });

console.log('Room found:', room);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        return res.status(200).json({ room, message: 'Room validated successfully' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}
const endcall = async (req, res) => {
    try {
        console.log("API HIT: /room/endcall");
console.log("Request body:", req.body);
        const validate = endCallSchema.safeParse(req.body);
        if (!validate.success) {
            return res.status(400).json(validate.error);
        }
        const { roomId, duration } = validate.data;
        const room = await Room.findOne({ roomId });
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        const updatedroom = await Room.findByIdAndUpdate(
            room._id,
            { $set: { duration } },
            { new: true }
        );
        return res.status(200).json({ message: 'Call ended successfully', room: updatedroom });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}
module.exports = {
    createroom,
    addparticipant, validateroom, endcall
};
