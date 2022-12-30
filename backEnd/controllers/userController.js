const ErrorHandler = require("../utils/errorHandler")
const cathAsyncError = require("../middleWare/asyncErrors")
const User  = require("../models/userModel")
const sendToken = require("../utils/jwtToken")
const {imageUpload,imageDelete} = require("../src/services")
const Address = require ("../models/addressModel")
const Log = require("../models/logModel")
const sendEmail = require("../utils/sendEmail")
const crypto = require("crypto")
exports.registerUser = cathAsyncError(async(req,res,next)=>{
    const {name , email , password,addresses} = req.body
    console.log(req.body);
    let data = {
        public_id : "This Is Sample ID",
        url : "This is sample Url",
        
    }
    if(req.file){
        data = await imageUpload(req.file.path ,"user-image");
        console.log(data);
    }   
    const user = await User.create({
        name,email,password,
        avatar:{
            public_id :data.public_id||"This Is Sample ID",
            url : data.url|| "This is sample Url",
        }, 
    })
    if(!user){
        return next( new ErrorHandler("User Does not Exist"))
    }
    const log = await Log.create({
        user : user.id,
        login : Date.now()
    })
    user.logDetail = log.id
    
    for(let i =0 ; i<addresses.length;i++){
        const address = await Address.create(addresses[i])
        user.addresses.push(address)
    }
    await user.save();
    sendToken(user,201,res)
})
exports.forgotPassword  = cathAsyncError(async (req,res,next)=>{
    const user  = await User.findOne({email : req.body.email})
    if(!user){
        return new ErrorHandler("User not Found", 404)
    }
    const resetToken = user.passwordResetToken()
    await user.save({validateBeforeSave : false})
    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`
    const message = `Your Password Reset Token is :  \n\n ${resetPasswordUrl} \n\n If you have not requested this email please Ignore it`
    try{
        
        await sendEmail({
            email : user.email,
            subject : `Ecommerse Password Recovery`,
            message,
        })
        console.log("saif");
        res.status(200).json({
            success : true,
            message : `Email Sent to ${user.email} Successfully`
        })
    }catch{
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined
        await user.save({validateBeforeSave : false})
        return next(new ErrorHandler(error.message , 500))
    }


})

exports.resetPassword = cathAsyncError(async (req,res,next)=>{
    const resetPasswordToken =  crypto.createHash("sha256").update(req.params.token).digest("hex")
    // console.log(resetPasswordToken);
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire : {$gt : Date.now()}
    })
    console.log(user);
    if(!user){
        return next(new ErrorHandler("Reset Password Token is invalid  OR has been expired ", 400))
    }
    console.log(req.body);
    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler("Password doesnt Match ", 400))
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined  
    await user.save()
    sendToken(user, 200, res)
})

exports.deleteUser = cathAsyncError(async(req,res,next)=>{
    const _id = req.params.id 
    let user = User.findById(req.params.id)
    if(!user){
        return next( new ErrorHandler("User Does not Exist"))
    }
    user = await User.findByIdAndDelete(_id)
    res.status(200).json({
        success: true,
        message :"User Deleted Successfully"
    })

})


exports.loginUser = cathAsyncError(async(req,res,next)=>{
    const {email, password} = req.body
    if(!email ||!password){
        return next(new ErrorHandler("Please Enter Username or Password" , 501))
    }
    const user = await User.findOne({email}).select("+password")
    if(!user){
        return next(new ErrorHandler("Invalid Email or Password",401))
    }

    // user.logDetai
    const isPasswordMatched = user.comparePassword(password);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid Email or Password",401))
    }
    const log = await Log.create({
        user : user.id,
        login : Date.now()
    })
    user.logDetail = log.id
    await user.save()

    sendToken(user,200,res)

})
 
exports.logoutUser = cathAsyncError(async (req,res,next)=>{
    const log = await Log.findByIdAndUpdate(req.user.logDetail,{
        user : req.user.id,
        logout : Date.now()
    })
    res.cookie("token", null, {
        expires :new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success : true,
        message : "Logged Out Successfully"
    })
})

exports.updateUser = cathAsyncError(async(req,res,next)=>{
    const _id = req.params.id
    let user = await User.findById(_id)
    if(!user){
        return next(new ErrorHandler("Product not Found", 404))
    }
    
    user = await User.findByIdAndUpdate(_id,req.body ,{new:true})
    res.status(200).json({
        success:true,
        user
    })
})
exports.getAllUsers = cathAsyncError(async (req,res,next)=>{
    const users = await User.find()
    res.status(200).json({
        success: true,
        users
    })
})
exports.getUser = cathAsyncError(async (req,res,next)=>{
    console.log("saif");
    const user = await User.findById(req.user.id)


    res.status(200).json({
        success: true,
        user
    })
})


exports.imageUpload = cathAsyncError(async (req,res,next)=>{
    // console.log("saif");
    console.log(req.file.path);
    const data = await imageUpload(req.file.path ,"user-image");
    console.log(data);
    const update = {
        avatar :{public_id:data.public_id,
        url: data.url}
    }
    const savedImg = await User.findByIdAndUpdate(req.user.id, update, {new:true})
    res.status(201).json({
        success: true,
        message : "Image Uploaded Successfully"
    })

})

exports.deleteImage = cathAsyncError(async (req,res,next)=>{
    const user = await User.findOne({_id: req.user.id})
    console.log(user);
    const public_id = user.avatar.public_id
    
    await imageDelete(public_id)
    const update = {
        avatar :{
        public_id:"",
        url: ""}
    }
    const savedImg = await User.findByIdAndUpdate(req.user.id, update, {new:true})
    res.status(200).json({
        success: true,
        message : "Image Deleted Successfully"
    })

})
exports.getLogs = cathAsyncError(async(req,res,next)=>{
    const _id = req.params.id
    // const date =req.query.date.split("-")
    let date = await addDays(req.query.date, 1)
    // console.log(date);
    const log = await Log.find({ login: {
            $gte: new Date(`${req.query.date}`),
            $lt: new Date(date)
               }})
    if(!log){
        return next(new ErrorHandler("log not Found", 404))
    }
    res.status(200).json({
        success: true,
        log
    })
})









exports.test = cathAsyncError(async (req,res,next)=>{
    const {name , email , password,addresses} = req.body
    console.log(addresses[0].address) 
    
    // console.log(req.body);
    const user = await User.create({
            name,email,password,
            avatar:{
                public_id :"This Is Sample ID",
                url : "This is sample Url",
            },        
        })
 
    const address = await Address.create()
    for(let i =0 ; i<addresses.length;i++){
        const address = await Address.create(addresses[i])
        user.addresses.push(address)
    }


    res.status(200).json({
        success: true,
        // message : "User Created Successfully"
        user
    })  
})

async function addDays(originalDate, days){
    cloneDate = new Date(originalDate.valueOf());
    cloneDate.setDate(cloneDate.getDate() + days);
    return cloneDate;
  }