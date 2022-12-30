const mongoose = require("mongoose")

const logSchema = new mongoose.Schema({
    user : {type: mongoose.Schema.ObjectId, required : true},
    login: {type: Date },
    logout : {type : Date}
})

module.exports = mongoose.model("Log", logSchema)