const Chat = require("../models/Message-model");
const Booking = require("../models/Booking-model");

//Send Message
const sendMessage = async (req, res) => {
    try {
        const { bookingId, message } = req.body;

        const booking = await Booking.findById(bookingId);

        //allow if accepted
        if (!booking ||booking.status !== "accepted") {
            return res.status(400).json({
                message: "Chat only allowed after booking accepted",
            });
        }

        const chat = await Chat.create({
            booking: bookingId,
            sender: req.user._id,
            message,
        });

        //EMIT Real-Time message
        req.io.to(bookingId).emit("receive_message",{
            bookingId,
            message,
            sender: {
                _id: req.user._id,
                name: req.user.name,
            },
        })

        res.json(chat);
        
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

//Get messages
const getMessages = async (req, res) => {
    try {
        const chats = await Chat.find({
            booking: req.params.bookingId,
        })
        .populate("sender", "name")
        .sort({ createdAt: 1 });

        res.json(chats);

    } catch (err){
        res.status(500).json({ message: err.message });
    }
}

module.exports = {
    sendMessage,
    getMessages
}