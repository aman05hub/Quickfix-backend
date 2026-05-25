const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();

const { protect } = require("../middleware/auth-middleware");
const { uploadProfilePic, deleteProfilePic, updateProfile, sendEmailChangeOtp, verifyEmailChange, updatePassword } = require("../controllers/user-controller");

router.post("/upload-profile", protect, upload.single("image"), uploadProfilePic);
router.delete("/delete-profile", protect, deleteProfilePic);
router.put("/update-profile", protect, updateProfile);
router.post("/change-email-otp", protect, sendEmailChangeOtp);
router.post("/verify-email", protect, verifyEmailChange);
router.put("/change-password", protect, updatePassword)

module.exports = router;