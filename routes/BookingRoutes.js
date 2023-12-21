const router = require("express").Router();
const auth = require("../middlewares/auth");

const {
  addBookingApi,
  updateBookingApi,
  getAllBookingsApi,
} = require("../controllers/BookingController");

router.post("/booking/add", addBookingApi);
// router.update('/booking/update',updateBookingApi)
router.post("/get-all-business-booking", auth, getAllBookingsApi);

module.exports = router;
