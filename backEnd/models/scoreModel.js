const mongoose = require("mongoose")

scoreBoardSchema = new mongoose.Schema({
    
    name : {type : String, required : true},
    user : {type: mongoose.Schema.ObjectId , required:true},
    avatar:
        {   
            public_id:{
                type: String,
                required: true
            },
            url : {
                type: String,
                required: true
            }
    },
    // team: [{type: mongoose.Schema.ObjectId, ref: "User" }],
    sport : {
        type : mongoose.Schema.ObjectId,
        ref : "Sport",
        required:true
    },

    
    grade : {
        type: Number,
        required  : true,
        default  : 0
    },
    createdAt:{
        type: Date,
        default : Date.now,
    }

})



module.exports = mongoose.model("Scoreboard", scoreBoardSchema)