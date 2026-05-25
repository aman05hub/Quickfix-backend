const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    service:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Service",
        required:true
    },
    provider:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    date:{
        type: Date,
        required:true
    },
    time:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        enum:["pending","accepted","rejected","on_the_way","completed"],
        default:"pending"
    },
    paymentStatus:{
        type:String,
        enum:["unpaid","paid"],
        default:"unpaid"
    },
    paymentId:{
        type: String
    },
    paymentEmail:{
        type: String
    },
    serviceType:{
        type: String,
        required: true
    }
},
{
    timestamps:true
});

module.exports = mongoose.model("Booking",bookingSchema)