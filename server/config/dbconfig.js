require('dotenv').config();
const mongoose=require('mongoose')
const dbconnect=async ()=>{
    try{
    await mongoose.connect(process.env.MONGODB_URL)
    console.log("database connected")
    }
    catch(err){
        console.log(err)
        }
}
module.exports=dbconnect;