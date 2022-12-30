const ErrorHandler = require("../utils/errorHandler")
const cathAsyncError = require("../middleWare/asyncErrors")
const User  = require("../models/userModel")
const Address = require("../models/addressModel")

exports.addAddress = cathAsyncError(async(req,res,next)=>{
    req.body.user  = req.user.id
    console.log(req.body);
    const address = await Address.create(req.body)
    if(!address){
        return next(new ErrorHandler("Address can not be created for this user", 400))
    }
    const user = await User.findById(req.body.user)
    if(!user){
        return next(new ErrorHandler("Address can not be created for this user", 400))
    }
    res.status(200).json({
        success : true,
        address,
        user
    })

    
})