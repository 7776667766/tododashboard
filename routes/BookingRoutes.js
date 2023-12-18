const router = require("express").Router();
const { addBookingApi, updateBookingApi, getAllBookingsApi }=require('../controllers/BookingController')

router.post("/booking/add", addBookingApi);
// router.update('/booking/update',updateBookingApi)
router.get('/booking/get',getAllBookingsApi)

module.exports = router;