const express = require("express");
const router = express.Router();
const { getAllProviders, approveProvider, getDashboard  } = require("../controllers/admin-controller");
const User = require("../models/User-model");
const { protect } = require("../middleware/auth-middleware");
const Booking = require("../models/Booking-model");
const isAdmin = require("../middleware/admin-middleware");

//Get all provider
router.get("/providers", protect, isAdmin, getAllProviders);

//Approve provider
router.put("/approve/:id", protect, isAdmin, approveProvider);

//Get dashboard data
router.get("/dashboard", protect, isAdmin, getDashboard);

//Get all users with name and email
router.get("/users", protect, isAdmin, async (req,res) => {
    try{
        const users = await User.find({ role: "user" }).select("name email");
        res.json(users);
    } catch (err){
        res.status(500).json({ message: "Server Error" });
    }
});

//Get all bookings with user and provider details
router.get("/bookings", protect, isAdmin, async (req,res) => {
    try{
        const bookings = await Booking.find()
        .populate("user", "name email")
        .populate("provider", "name email")
        .sort({ createdAt: -1 });
    
        res.json(bookings);
    }catch (err){
        res.status(500).json({ message: "Server Error" });
    }
});

//Get payment stats
router.get("/payment-stats", protect, isAdmin, async (req,res) => {
    try{
        const totalPayments = await Booking.aggregate([
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$amount" },
                    count: { $sum: 1 }
                }
            }
        ])
        res.json(totalPayments[0] || { totalAmount: 0, count: 0 });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;