const mongoose = require('mongoose');
require('dotenv').config();

const connectDb = async() => {
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("db connected")
    }catch(err){
        console.log(err)
    }
}

module.exports = connectDb
