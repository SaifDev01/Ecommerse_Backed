const Score = require("../models/scoreModel")
const Product = require("../models/productModel")
const ErrorHandler = require("../utils/errorHandler") 
const catchAsyncError = require("../middleWare/asyncErrors")
const userModel = require("../models/userModel")
const User = require("../models/userModel")
const Sport = require("../models/sportModel")

exports.newScore = catchAsyncError(async (req,res,next)=>{
    let {sportType,team , grade} = req.body
    // console.log(req.user.id)
    team.push(req.user.id)
    const sport = await Sport.create({
        sportType, 
        team    
    })
    const a = await Sport.findById(sport.id)
    console.log(a);
    // const a = await Sport.findById(sport.id).populate("team").exec()
    if(!sport){
        return next(new ErrorHandler("Sport can not Be Created", 404))
    }
    const score = await Score.create({
        name : req.user.name,
        user : req.user._id,
        avatar: req.user.avatar,
        sport : sport.id,
        grade,
    })
    const b = await Score.findById(score.id).populate({
        path : "sport",
        populate : {
            path: "team",
            model : "User",
            populate : {
                path : "addresses",
                model : "Address"
            }
        }
}).exec()
    if(!score){
        console.log("fuck");
    }



























    // const grade = req.body.grade
    // const user  = User.findById(req.user.id)
    // const score = await Score.create({
    //     name : req.user.name,
    //     user : req.user._id,
    //     avatar: req.user.avatar,
    //     grade,

    // })

    // const {sportType, grade} = req.body
    // const teams = [];
    // (req.body.team).forEach((team)=>{
    //     teams.push(team.user)
    // })
    
    // const _team = await User.find().where('_id').in(teams).exec();
   
    // const _team = await User.find().where('_id').in(teams).exec();
    // for(let i =0 ; i<_team.length;i++){
    //     console.log(_team[i]);
    //     score.team.push(_team[i])
    // }
    
    
    res.status(201).json({
        success: true,
        b
    })
})

exports.getAllScore = catchAsyncError(async (req,res,next)=>{
    console.log("saif");
    const scores = await Score.find()
    res.status(200).json({
        success: true,
        scores
    })
})

exports.deleteScore = catchAsyncError(async(req,res,next)=>{
    const _id = req.params.id
    const score = Score.findById(_id)
    if(!score){
        return next(new ErrorHandler("No Score Found ", 404))
    }
    await score.findByIdAndDelete(_id)
    res.status(200).json({
        success:true,
        message: "Score Deleted Successfully"
    })
})

exports.getScore = catchAsyncError(async (req,res,next)=>{
    const score = await Score.findById(req.params.id)
    if(!score){
        return next(new ErrorHandler("No Score Found ", 404))
    }
    res.status(200).json({
        success: true,
        score
    })
})
exports.updateScore = catchAsyncError(async (req,res,next)=>{
    const score = await Score.findByIdAndUpdate(req.params.id, req.body , {new:true})
    if(!score){
        return next(new ErrorHandler("Score not Found ", 404))
    }
    res.status(200).json({
        success: true,
        score
    })

})


// exports.deleteScore = catchAsyncError(async(req,res, next)=>{
//     const _id = req.params.id
//     let score = await Score.findById(_id)
//     if(!score){
//         return next(new ErrorHandler("Score not Found", 404))
//     }
//     score = await Score.findByIdAndDelete(_id)
//     res.status(200).json({
//         success : true,
//         score
//     })
// })