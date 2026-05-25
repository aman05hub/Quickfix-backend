const User = require("../models/User-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const transporter = require("../config/mail");

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendOtp(req, res){
    try{
        const { email } = req.body;

        console.log("EMAIL_USER:", process.env.EMAIL_USER);

        console.log(
            "EMAIL_PASS:",
            process.env.EMAIL_PASS ? "EXISTS" : "MISSING"
        );

        console.log("Incoming Email:", email);

        if(!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        //Check existing user
        const existingUser = await User.findOne({ email });

        if(existingUser && existingUser.isVerified){
            return res.status(400).json({ 
                message: "Email is already registered" 
            });
        }

        //Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        console.log("OTP:",otp);

        //Save Otp in DB
        await User.findOneAndUpdate(
            { email },
            {
                email,
                otp,
                otpExpire: Date.now() + 5 * 60 * 1000,
                isVerified: false,
            },
            { upsert: true, new: true }
        );

        console.log("Sending email...");

        //Email OTP
        await transporter.sendMail({
            from: `"QuickFix "<${process.env.EMAIL_USER}> `,
            to: email,
            subject: "QuickFix OTP Verification",
            html: `
            <div style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px;">
                <div style="max-width: 500px; margin: auto; background: white; padding: 20px; border-radius: 10px; text-align: center;">
                
                <h2 style="color: #333;">
                    <img src="https://ik.imagekit.io/nuavc0dai/service.svg" width="120" />
                </h2>
                
                <h3 style="color: #444;">OTP Verification</h3>
                
                <p style="color: #666;">Use the OTP below to complete your registration:</p>
                
                <div style="font-size: 28px; font-weight: bold; color: #2d89ef; margin: 20px 0;">
                    ${otp}
                </div>
                
                <p style="color: #999;">This OTP is valid for 5 minutes ⏱️</p>
                
                <hr style="margin: 20px 0;">
                
                <p style="font-size: 12px; color: #aaa;">
                    If you did not request this, please ignore this email.
                </p>
                </div>
            </div>
            `
        });

        console.log("Email sent successfully!");

        res.json({
            message: "OTP send successfully to your email 📧"
        });

    } catch(err){
        console.log("Send OTP Error:", err.message);
        res.status(500).json({
            message: err.message
        });
    }
}

//Verify OTP and Register
async function verifyOtp(req, res){
    try{

        console.log("Verify OTP Body:", req.body);

        const { name, email, password, role, profession, serviceType ,otp } = req.body; 

        //Find user
        const user = await User.findOne({ email });

        if(!user){
            return res.status(400).json({
                message: "user not found"
            })
        }

        //OTP Check from DB
        if(!user.otp || user.otp.toString() !== otp.toString().trim()){
            return res.status(400).json({
                message: "Invalid OTP ❌"
            })
        }

        //OTP Expire Check
        if(user.otpExpire < Date.now()) {
            return res.status(400).json({
                message: "OTP expired ⌛"
            })
        }

        //Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const userRole = role === "provider" ? "provider" : "user";


        console.log("ENTERED OTP:", otp);
console.log("SAVED OTP:", user.otp);
console.log("EXPIRE:", user.otpExpire);
console.log("NOW:", Date.now());

        //Update existing user
        user.name = name;
        user.password = hashedPassword;
        user.role = userRole;
        user.profession = userRole === "provider" ? profession : null;
        user.serviceType = userRole === "provider" ? serviceType : null;
        user.isApproved = userRole === "provider" ? false : true;
        user.isVerified = true;

        //Clear OTP
        user.otp = null;
        user.otpExpire = null;

        await user.save();

        res.status(201).json({
            message: "Registration successful ✅",
            user,
        })
    }catch(err){
        console.log("Verify OTP Error:", err);
        res.status(500).json({
            message: err.message
        })

    }
}

//login
async function login(req, res){
    try{
        const { email, password } = req.body;

        //Check user
        const user = await User.findOne({ email });

        if(!user){
            return res.status(400).json({
                message: "Email not found"
            })
        }

        if(!user.password){
            return res.status(400).json({
                message: "Please complete registration first (verify OTP)"
            })
        }

        //check approval for provider
        if(user.role === "provider" && !user.isApproved) {
            return res.status(403).json({
                message: "Wait for admin approval ⌛",
            })
        }

        //Check password
        const isMatch = await bcrypt.compare(password, user.password);
        
        if(!isMatch){
            return res.status(400).json({
                message: "Incorrect password",
            })
        }

        //Generate token
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
        })
    } catch(err){
        console.log("Login Error:", err.message);
        res.status(500).json({
            message: err.message
        })
    }
}

// //Register
// async function register(req,res){
//     try{
//         console.log("Register Body:", req.body);

//         const { name,email,password,role, serviceType, profession } = req.body;

//         if (!name || !email || !password) {
//             return res.status(400).json({ message: "All fields are required" });
//         }

//         //valid role
//         const userRole = role === "provider" ? "provider" : "user";

//         //Check exixting user
//         const existingUser = await User.findOne({ email });
//         if(existingUser)
//             return res.status(400).json({ message: "User already exixts"});

//         //hash password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         //create user
//         const user = await User.create({
//             name,
//             email,
//             password:hashedPassword,
//             role: userRole,
//             profession: userRole === "provider" ? profession : null,
//             isApproved: userRole === "provider" ? false : true,
//         });

//         res.status(201).json({
//             message: "User Registered Successfully"
//         });

//     }catch(err){
//         console.error(err)
//         res.status(500).json({ error: err.message})
//     }
// };

// async function login(req, res){

//     try{
//         const { email, password } = req.body;

//         //check user exists
//         const user = await User.findOne({ email });
//         if(!user){
//             return res.status(400).json({ message: "Email not found"});
//         }

//         if(user.role === "provider" && !user.isApproved){
//             return res.status(403).json({
//                 success: false,
//                 message: "Wait for admin approval ⌛"
//             })
//         }

//         //compare password
//         const isMatch = await bcrypt.compare(password, user.password);
//         if(!isMatch){
//             return res.status(400).json({ message: "Incorrect password"})
//         }

//         //Generate token
//         const token = jwt.sign(
//             { id: user._id , role: user.role},
//             process.env.JWT_SECRET,
//             { expiresIn: "7d" }
//         );

//         res.status(200).json({
//             message: "Login successful",
//             token,
//             user:{
//                 id: user._id,
//                 name: user.name,
//                 email: user.email,
//                 role: user.role
//             }
//         });

//     }catch(err){
//         res.status(500).json({ message: err.message});
//     }
// }

module.exports = { 
    sendOtp,
    verifyOtp,
    login,
 };