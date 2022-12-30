const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const AsyncError = require("../middleWare/asyncErrors");
const ApiFeatures = require("../utils/apiFeatures");
const {imageUpload } = require("../src/services");


// Admin
exports.createProduct = AsyncError(async(req , res, next)=>{
    let images = req.files
    const imageLinks = []
    // console.log(images);
    // await images.forEach(image=>{
    //     const a = imageUpload(image.path,"product-image")
    //     console.log(a);
    //     imageLinks.push({
    //         public_id : a.public_id,
    //         url: a.url
    //     })
    //     })
    for(let i = 0 ; i < images.length ; i++){
        const result = await imageUpload(images[i].path, "product-images")
        imageLinks.push({
            public_id: result.public_id,
            url: result.url,
        });
    }
    console.log(imageLinks);
    req.body.images = imageLinks
    req.body.user = req.user.id
    
    const product = await Product.create(req.body);
    if(!product){
        return next(new ErrorHandler("Product can not be Created", 404))
    }
    res.status(201).json({
        success: true,
        product
    }) 
})

exports.getAllProducts= AsyncError(async(req,res)=>{
    const resultPerPage = 10;
    const productCount = await Product.countDocuments()
    // console.log(req.query)
    const apiFeatures  = new ApiFeatures(Product.find(), req.query).search().filter().pagination(resultPerPage)
    
    const products = await apiFeatures.query
    res.status(200).json({
        success : true,
        products,
        productCount

    })
})

exports.deleteProduct = AsyncError(async(req,res, next)=>{
    const _id = req.params.id
    let product = await Product.findById(_id)
    if(!product){
        return next(new ErrorHandler("Product not Found", 404))
    }
    product = await Product.findByIdAndDelete(_id)
    res.status(200).json({
        success : true,
        product
    })
})

exports.updateProduct = AsyncError(async(req, res, next)=>{
    const _id = req.params.id
    let product = await Product.findById(_id)
    if(!product){
        return next(new ErrorHandler("Product not Found", 404))
    }
    
    product = await Product.findByIdAndUpdate(_id,req.body ,{new:true})
    res.status(200).json({
        success:true,
        product
    })
})

exports.getProduct = AsyncError(async(req,res,next)=>{
    const _id = req.params.id
    let product = await Product.findById(_id)
    if(!product){
        return next(new ErrorHandler("Product not Found", 404))
    }
    res.status(200).json({
        success: true,
        product
    })
})






