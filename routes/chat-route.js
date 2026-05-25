const express = require("express");
const router = express.Router();

const { sendMessage, getMessages } = require("../controllers/chat-controller");
const { protect } = require("../middleware/auth-middleware");

//send message
router.post("/", protect, sendMessage);

//get messages
router.get("/:bookingId", protect, getMessages);

module.exports = router;