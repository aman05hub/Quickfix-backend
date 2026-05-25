const imagekit = require("../config/imagekit");
const User = require("../models/User-model");
const transporter = require("../config/mail");
const bcrypt = require("bcryptjs");

const uploadProfilePic = async (req, res) => {
    try{
        const file = req.file;

        if(!file){
            return res.status(400).json({ message: "No file uploaded" });
        }

        const result = await imagekit.upload({
            file: file.buffer,
            fileName: file.originalname
        });

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { 
                profilePic: result.url,
                profilePicId: result.fileId,
            },
            { new: true }
        );

        res.json({ message: "Uploaded", url: result.url, user });

    } catch (err) {
        res.status(500).json({ message: err.message});
    }
}

const deleteProfilePic = async (req, res) => {
    try{
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { profilePic: "" },
            { new: true }
        );

        res.json({ message : "Profile photo removed", user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const updateProfile = async (req, res) => {
    try{
        const user = await User.findByIdAndUpdate(
            req.user._id,
        {
            name: req.body.name,
            email: req.body.email,
        },
        { new: true }
    );

    res.json(user);

    } catch (err){
        res.status(500).json({ message: err.message })
    }
}

const sendEmailChangeOtp = async (req, res) => {
    try{
        const { newEmail } = req.body;

        if(!newEmail) {
            return res.status(400).json({ message: "Email required"});
        }

        //Check duplicate
        const existing = await User.findOne({ email: newEmail })
        if(existing){
            return res.status(400).json({ message: "Email already exists" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const user = await User.findById(req.user._id);

        user.emailOtp = otp;
        user.emailOtpExpire = Date.now() + 5 * 60 * 1000;
        user.newEmail = newEmail;

        await user.save();

        await transporter.sendMail({
            from: `"QuickFix" <${process.env.EMAIL_USER}>`,
            to: newEmail,
            subject: "Verify your new email",
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

        res.json({
            message: "OTP send to new email 📧"
        }); 
    }
    catch (err){
        res.status(500).json({ message: err.message });
    }
}

const verifyEmailChange = async (req, res) => {
    try{
        const { otp } = req.body;

        const user = await User.findById(req.user._id);

        if(!user || user.emailOtp !== otp){
            return res.status(400).json({ message: "Invalid OTP"});
        }

        if(user.emailOtpExpire < Date.now()) {
            return res.status(400).json({ message: "OTP expired" });
        }

        user.email = user.newEmail;
        user.newEmail = null;
        user.emailOtp = null;
        user.emailOtpExpire = null;

        await user.save();

        res.json({ message: "Email updated", user });

    } catch (err){
        res.status(500).json({ message: err.message });
    }
}

const updatePassword = async (req, res) => {
    try{
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(req.user._id);

        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if(!isMatch){
            return res.status(400).json({ message: "Current password is incorrect" });
        }

        user.password = await bcrypt.hash(newPassword, 10);

        await user.save();

        res.json({ message: "Password updated successfully" });
    
    } catch (err){
        res.status(500).json({ message: err.message });
    }
}

module.exports = {
    uploadProfilePic,
    deleteProfilePic,
    updateProfile,
    sendEmailChangeOtp,
    verifyEmailChange,
    updatePassword
};