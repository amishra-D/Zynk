const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  roomId: {
    type: String,
    unique: true,
    required: true
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  host:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  endedAt: {
    type: Date,
    default: null
  },
  duration: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const Room = mongoose.model('Room', RoomSchema);
module.exports = Room;
