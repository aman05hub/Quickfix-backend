require("dotenv").config();
const User = require("../models/User-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendOtpEmail } = require("../config/mail");

async function sendOtp(req, res){
    try{
        const { email } = req.body;

        console.log("Incoming Email:", email);

        if(!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        // Check existing user
        const existingUser = await User.findOne({ email });
        if(existingUser && existingUser.isVerified){
            return res.status(400).json({ message: "Email is already registered" });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        console.log("OTP:", otp);

        // Save OTP in DB
        await User.findOneAndUpdate(
            { email },
            { email, otp, otpExpire: Date.now() + 5 * 60 * 1000, isVerified: false },
            { upsert: true, new: true }
        );

    
        let emailSent = false;
        try {
            await sendOtpEmail(email, otp);
            emailSent = true;
            console.log("Email sent successfully!");
        } catch(emailErr) {
            console.log("Email send failed (IP restriction):", emailErr.response?.data?.message || emailErr.message);
        }

        // Always return OTP in response for demo purposes
        res.json({
            message: emailSent
                ? "OTP sent to your email 📧"
                : "⚠️ Email service unavailable (IP restriction). Use the OTP below to continue:",
            otp: otp,  // shown on frontend for demo
            emailSent
        });

    } catch(err){
        console.log("Send OTP Error:", err.message);
        res.status(500).json({ message: err.message });
    }
}

// Verify OTP and Register
async function verifyOtp(req, res){
    try{
        const { name, email, password, role, profession, serviceType, otp } = req.body;

        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({ message: "User not found" });
        }

        if(!user.otp || user.otp.toString() !== otp.toString().trim()){
            return res.status(400).json({ message: "Invalid OTP ❌" });
        }

        if(user.otpExpire < Date.now()) {
            return res.status(400).json({ message: "OTP expired ⌛" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userRole = role === "provider" ? "provider" : "user";

        user.name = name;
        user.password = hashedPassword;
        user.role = userRole;
        user.profession = userRole === "provider" ? profession : null;
        user.serviceType = userRole === "provider" ? serviceType : null;
        user.isApproved = userRole === "provider" ? false : true;
        user.isVerified = true;
        user.otp = null;
        user.otpExpire = null;

        await user.save();

        res.status(201).json({ message: "Registration successful ✅", user });

    } catch(err){
        console.log("Verify OTP Error:", err);
        res.status(500).json({ message: err.message });
    }
}

// Login
async function login(req, res){
    try{
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({ message: "Email not found" });
        }

        if(!user.password){
            return res.status(400).json({ message: "Please complete registration first (verify OTP)" });
        }

        if(user.role === "provider" && !user.isApproved) {
            return res.status(403).json({ message: "Wait for admin approval ⌛" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({ message: "Incorrect password" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profession: user.profession,
            }
        });

    } catch(err){
        console.log("Login Error:", err.message);
        res.status(500).json({ message: err.message });
    }
}

module.exports = { sendOtp, verifyOtp, login };
