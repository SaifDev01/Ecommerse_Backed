const { kMaxLength } = require("buffer")
const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const crypto = require("crypto")
require("./addressModel")
const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true , "Please Enter Your Name"],
        maxLength : [30, "Name can not Exceed 30 Character"],
        minLength : [3 , "Name should have more than 3 character"]

    },
    email : {
        type : String , 
        required : [true , "Enter Your Email"],
        unique : true,
        validate : [validator.isEmail , " Please Enter  a Valid Email"],
    },
    password : {
        type : String ,
        required : [true , "Enter Your Password"] ,
        minLength : [8 , "Password should be Greater than 8 Character "],
        select : false

    },
    avatar : {
        public_id :{
            type : String, 
            required : true
        },
        url : {
            type : String,
            required : true
        }

    },
    addresses:[{
        type: mongoose.Schema.ObjectId,
        ref: "Address",
        required :true
    }],
    logDetail : {type: mongoose.Schema.ObjectId , ref : "Log"},
    resetPasswordToken : String,
    resetPasswordExpire : Date,

})
userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        next()
    }
    this.password = await bcrypt.hash(this.password, 10)


})


userSchema.methods.getJWTToken = function(){
    return jwt.sign({id :this._id }, process.env.JWT_SECRET , {
        expiresIn : process.env.JWT_EXPIRE
    })      
}

userSchema.methods.passwordResetToken = function(){
    const resetToken  = crypto.randomBytes(20).toString("hex")
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")
    this.resetPasswordExpire = Date.now() + 15*60*1000;
    // console.log(this.resetPasswordExpire);
    return resetToken
}
userSchema.methods.comparePassword =async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
}

module.exports = mongoose.model("User", userSchema)




