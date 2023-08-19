const mongoose = require("mongoose");

const connectDB = async (req, res) =>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology:true});
        console.log("mongodb connected" + conn.connection.host);
    }
    catch(err){
        console.log("Db connection error" + err.message);
    }
}

module.exports = connectDB;