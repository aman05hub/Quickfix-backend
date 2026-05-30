const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
    title:{
        type:String,
        required: true,
        trim: true,
    },

    description:{
        type: String,
        default: "",
    },

    price:{
        type:Number,
        required: true,
        min: 0,
    },

    category:{
        type:String,
        required:true,
        enum:["electrician","plumber","cleaning","ac"]
    },

    serviceType:{
    type:String,
    required:true,
    enum:[
        "AC Cleaning",
        "AC Repair",
        "Fan Repair",
        "Laptop Repair",
        "Mobile Repair",
        "Electrician",
        "Plumber",
        "Painter",
        "Carpenter",
        "Home Cleaning",
        "Water Purifier",
        "TV Repair",
        "Washing Machine Repair",
        "Refrigerator Repair"
    ]
},

    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true,
    }
},
{
    timestamps:true
});

module.exports = mongoose.model("Service", serviceSchema);