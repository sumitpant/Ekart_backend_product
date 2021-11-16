const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id:{
        type:Number,
        required: true

    },
    category:{
        type:String,
        required : [true , 'Category must be present'],
        trim : true,
    },
    description:{
        type:String,
        required:[true , 'Description cannot be empty']
    },
    image:{
        type: String,
        required:true
    },
    price :{
        type:Number,
        required:true
    },
    rating:{
        type:Number,
        required: true
    },
    title: {
        type:String,
        required:true
    }

})
const Product = new mongoose.Schema({

    product : {
        type: [productSchema], 
        required :[true ,'Product required']
    }
})
module.exports =mongoose.model('Product',Product, 'logins')