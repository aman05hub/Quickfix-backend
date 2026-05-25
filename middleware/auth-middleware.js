const jwt = require("jsonwebtoken");
const User = require("../models/User-model");

async function protect(req,res,next){
    try{
        let token;

        //Check Authorization header
        if(
            req.headers.authorization && 
            req.headers.authorization.startsWith("Bearer")
        ){
            token = req.headers.authorization.split(" ")[1];
        }

        console.log("Token:", token);

        //No token
        if(!token){
            return res.status(401).json({ 
                success: false,
                message: "Not authorized, token missing" 
            });
        }

        //Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //Get user from DB
        const user = await User.findById(decoded.id).select("-password");

        if(!user){
            return res.status(401).json({
                success: false,
                message: "User not found",
            })
        }

        //Attach full user
        req.user = user;

        next();

    }catch(err){
       console.log("JWT Error:", err.message);

       return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
       })
    }
}

module.exports = { protect };