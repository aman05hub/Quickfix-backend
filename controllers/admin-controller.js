const User = require("../models/User-model");
const Booking = require("../models/Booking-model");

const getAllProviders = async (req, res) => {
    const providers = await User.find({ role: "provider" });
    res.json(providers);
}

const approveProvider = async (req, res) => {
    await User.findByIdAndUpdate(req.params.id, {
        isApproved: true,
    });

    res.json({ message: "Provider Approved" });
}

const getDashboard = async (req, res) => {
    const users = await User.countDocuments({ role: "user" });
    const providers = await User.countDocuments({ role: "provider" });
    const bookings = await Booking.countDocuments();

    res.json({ 
        users,
        providers,
        bookings
    });
}

module.exports = { 
    getAllProviders, 
    approveProvider, 
    getDashboard 
};