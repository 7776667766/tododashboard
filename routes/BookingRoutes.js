const router = require("express").Router();
const auth = require("../middlewares/auth");

const {
  addBookingApi,
  updateBookingApi,
  getBookingByBusinessApi,
} = require("../controllers/BookingController");

router.post("/booking/add", addBookingApi);
// router.update('/booking/update',updateBookingApi)
router.post("/get-my-business-booking", auth, getBookingByBusinessApi);

module.exports = router;
