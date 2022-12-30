const mongoose = require("mongoose")

const sportSchema = new mongoose.Schema({
    sportType : {type : String, required : true},
    
    team: [{type: mongoose.Schema.ObjectId, ref: "User" }],

})


module.exports = mongoose.model("Sport", sportSchema)
