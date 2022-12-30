const mongoose = require("mongoose")

const con = ()=>{
    mongoose.set('strictQuery', true)
    mongoose.connect(process.env.DB_URL).then((data)=>{
        console.log(`MongoDB connected with Server Host ${data.connection.host}`);
    })
}

module.exports = con;


