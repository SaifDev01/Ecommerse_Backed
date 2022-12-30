const mongoose = require("mongoose")
const User = require("../models/userModel")

const addressSchema = new mongoose.Schema({
    // user : {
    //     type: mongoose.Schema.ObjectId,
    //     ref: "User",
    //     required : true
    // },
        address:{type:String , required : true}
    })
module.exports = mongoose.model("Address", addressSchema)



