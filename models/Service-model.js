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