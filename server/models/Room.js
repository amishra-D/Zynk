const mongoose=require('mongoose')
const RoomSchema=new mongoose.Schema({
    roomId: {type:String,unique:true,required:true},
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
   startedAt:{ type: Date, default: Date.now },
  endedAt:{ type: Date, default: Date.now },
  duration:Int,
})
const Room=mongoose.model('Room',RoomSchema);
module.exports=Room