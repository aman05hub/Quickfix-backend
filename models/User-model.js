const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    
    name:{
        type:String,
        required:true
    },

    email:{
        type:String,
        unique: true,
        required: true
    },

    password:{
        type:String,
        required:true
    },

    otp: String,
    otpExpire: Date,
    isVerified: {
        type: Boolean,
        default: false
    },

    role:{
        type:String,
        enum:["user","provider","admin"],
        default:"user"
    },

    // serviceType: {
    //     type: String,
    //     enum: ["electrician", "plumber", "cleaning", "ac"],
    //     required: function() {
    //         return this.role === "provider";
    //     },
    //     default: null
    // },

    isApproved: {
        type: Boolean,
        default: false
    },

    profession:{
        type: String,
        required: function(){
            return this.role === "provider";
        },
    },

    profilePic:{
        type: String,
        default: ""
    },

    profilePicId: {
        type: String,
        default: "",
    }
}, 
{
    timestamps:true
}
);

module.exports = mongoose.model("User",userSchema);