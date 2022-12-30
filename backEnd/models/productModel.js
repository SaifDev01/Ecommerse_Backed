const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    name: {
        type : String,
        required : [true,"Please Enter Product Name"],
        trim: true
    },
   
    price: {
        type: Number,
        required: [true , "Please Enter Product's Price"],
        maxLength: [8 , "Price can not exceed 8 digits"],
    },
    images:[
        {   
            public_id:{
                type: String,
                required: true
            },
            url : {
                type: String,
                required: true
            }
        }
    ],

    stock :{
        type: Number,
        required : [true , "Please Enter Product Stock"],
        maxLength : [4 , "Stock can not exceed 4 digit"],
        default : 1
    }, 
 
    createdAt:{
        type : Date,
        default : Date.now
    }
}) 


module.exports = mongoose.model("Product", productSchema)
