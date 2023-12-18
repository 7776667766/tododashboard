const router = require("express").Router();
const authRoutes = require("./AuthRoutes");
const serviceRoutes = require("./ServiceRoutes");
const businessRoutes = require("./BusinessRoutes");
const bookingRoutes=require('./BookingRoutes')

router.use("/api", authRoutes);
router.use("/api", serviceRoutes);
router.use("/api", businessRoutes);
router.use('/api', bookingRoutes)

module.exports = router;
