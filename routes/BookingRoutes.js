const router = require("express").Router();
const auth = require("../middlewares/auth");

const {
  addBookingApi,
  updateBookingApi,
  getBookedTimeSlots,
  getBookingByBusinessApi,
  getBookingbyUserId,
  deleteBookingApi,
  completeBookingApi,
  cancelBookingApi,
  resehduledBookingApi,
} = require("../controllers/BookingController");

router.post("/booking/add", auth, addBookingApi);

router.post("/get-my-business-booking", auth, getBookingByBusinessApi);

router.post("/get-booking-Slots", getBookedTimeSlots);

router.get("/get-booking-by-userId", auth, getBookingbyUserId);

router.get("/booking/delete/:bookingId", deleteBookingApi);
router.get("/booking/completed/:bookingId", completeBookingApi);
router.get("/booking/cancel/:bookingId", auth, cancelBookingApi);
router.post("/booking/rescheduled/:bookingId", resehduledBookingApi);

module.exports = router;
