const express = require("express");
const router = express.Router();

const { sendOtp, verifyOtp, login } = require("../controllers/auth-controller");
const transporter = require("../config/mail")
const bcrypt = require("bcryptjs");
const User = require("../models/User-model")

router.post("/login", login);

router.post("/send-otp", sendOtp);

router.post("/verify-otp", verifyOtp);

module.exports = router;