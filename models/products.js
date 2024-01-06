const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Provide a name"],
    },
    price:{
        type:Number,
        required:[true,"Provide a price"],
    },
    featured:{
        type:Boolean,
        default:false,
    },
    rating:{
        type:Number,
        default:4.5,
    },
    CreatedAt:{
        type:Date,
        default:Date.now(),
    },
    company:{
        type: String,
        enum: {
          values: ['ikea', 'liddy', 'caressa', 'marcos'],
          message: '{VALUE} is not supported',
        },
    },
})

module.exports = mongoose.model("Products", productSchema);