const ErrorHandler = require("../utils/errorHandler")
const cathAsyncError = require("../middleWare/asyncErrors")
const Order  = require("../models/orderModel")
const Product = require("../models/productModel")
const sendEmail = require("../utils/sendEmail")
exports.createOrder = cathAsyncError(async (req,res,next)=>{
    let {shippingInfo,orderItems} = req.body
    let totalPrice = 0, itemPrice,items =[], taxPrice, shippingPrice = 200;
    let bill = ""
    const userInfo = {
        user: req.user._id,
        name: req.user.name,
        email : req.user.email
    }
    orderItems.forEach((item)=>{
        // items.add[]
        items.push(`${item.product}`)
    })      
    const products = await Product.find().where('_id').in(items).exec();
    if(!products){
        return next(new ErrorHandler("Product not Found",404))
    }
    for(let i = 0 ; i<orderItems.length;i++){
        if(products[i].stock <=0){
            return next(new ErrorHandler("Out of Stock ",404))
            break
        }
        
        orderItems[i].name = products[i].name
        orderItems[i].price = products[i].price
        const price = products[i].price * orderItems[i].quantity
        await updateStock(orderItems[i].product,orderItems[i].quantity)
        bill+= `<tr><td>${products[i].name}</td><td>${products[i].price}</td><td>${orderItems[i].quantity}</td><td>${price}</td><td>Processing</td></tr>`
        totalPrice+=price
    }
    itemPrice = totalPrice
    taxPrice = totalPrice * 0.05
    totalPrice+= taxPrice+shippingPrice
    const order = await Order.create({
        shippingInfo,
        orderItems,
        itemPrice,
        taxPrice,
        shippingPrice,
        userInfo,
        totalPrice,
        paidAt : Date.now(),
    })
    if(!order){
        return next(new ErrorHandler("Order can not be Created", 404))
    } 
    const message = "You Have Successfully Ordered"
    const messager = `<h1>Order Receipt</h1><table border="1"><tr><td>Items</td><td>Price</td><td>Quantity</td><td>Total</td><td>Status</td></tr>${bill}</table><h3>Total Bill : ${totalPrice}</h3>`
    try{
        
        await sendEmail({
            email : req.user.email,
            subject : `Order Placed`,
            message,
            html : messager
        })
        res.status(200).json({
            success : true,
            message : `Email Sent to ${req.user.email} Successfully`,
            order
        })
    }catch{
        return next(new ErrorHandler( console.error, 500))
    }

})

exports.userOrder = cathAsyncError(async(req,res,next)=>{
    const orders = await Order.find({
        user : req.user._id
    })
    if(!orders){
        return next(new ErrorHandler(`Order not found with this id `),404)
    }
    res.status(200).json({
        success : true,
        orders,
    })
    
})

async function updateStock(id , quantity){
    const product = await Product.findById(id)
    product.stock -= quantity
    await product.save({validateBeforeSave:false})
    
}



// async function send(order, email){
    
//     try{
        
//         await sendEmail({
//             email : email,
//             subject : `Order Places`,
//             order,
//         })
//         res.status(200).json({
//             success : true,
//             message : `Email Sent to ${email} Successfully`
//         })
//     }catch{
//         return next(new ErrorHandler(error.message , 500))
//     }
// }