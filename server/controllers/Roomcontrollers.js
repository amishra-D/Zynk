const Room = require('../models/Room');

const createroom = async (req, res) => {
    try {
        const { roomId, participants = [], duration = 0, host } = req.body;

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

module.exports = {
    createroom,
    addparticipant
};
