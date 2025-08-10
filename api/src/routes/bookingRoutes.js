const express = require("express");
const {
  getAvailableSlots,
  bookSlot,
  getMyBookings,
  getAllBookings,
} = require("../controllers/bookingController");
const {
  authenticateToken,
  authorizeRole,
  UserRole,
} = require("../middleware/auth");

const router = express.Router();

// All these routes require a user to be logged in
router.use(authenticateToken);

router.get("/slots", getAvailableSlots);
router.post("/book", bookSlot);
router.get("/my-bookings", getMyBookings);
router.get("/all-bookings", authorizeRole(UserRole.ADMIN), getAllBookings); // Only for ADMIN

module.exports = router;
