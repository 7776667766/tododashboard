const router = require("express").Router();
const auth = require("../middlewares/auth");

const {
  addBookingApi,
  updateBookingApi,
  getBookedTimeSlots,
  getBookingByBusinessApi,
  // getRemainingTimeSlots
} = require("../controllers/BookingController");

router.post("/booking/add", auth, addBookingApi);
// router.update('/booking/update',updateBookingApi)
router.post("/get-my-business-booking", auth, getBookingByBusinessApi);
router.post("/get-booking-Slots", getBookedTimeSlots);
// router.get("/get-available-Slots", getRemainingTimeSlots)

module.exports = router;
