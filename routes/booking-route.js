const express = require("express");
const router = express.Router();
const { createBooking, getMyBookings, getProviderBookings, updateBookingStatus, payBooking, createBookingAfterPayment } = require("../controllers/booking-controller");
const { protect } = require("../middleware/auth-middleware");
const allowRoles = require("../middleware/role-middleware");

//Only user can create booking
router.post("/", protect, allowRoles("user"), createBooking);

//get user booking
router.get("/my", protect, allowRoles("user"), getMyBookings);

//provider get their booking
router.get("/provider", protect, allowRoles("provider"), getProviderBookings);

//provider update there booking
router.put("/:id/status", protect, allowRoles("provider"), updateBookingStatus);

//User pays for booking
router.put("/:id/pay",protect, allowRoles("user"), payBooking)

router.post("/after-payment", protect, createBookingAfterPayment);

module.exports = router;