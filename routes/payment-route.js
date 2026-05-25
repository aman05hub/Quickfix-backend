const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/auth-middleware");
const  createOrder  = require("../controllers/payment-controller");

router.post("/create-order", protect, createOrder);

module.exports = router;