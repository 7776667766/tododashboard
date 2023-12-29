const router = require("express").Router();
const authRoutes = require("./AuthRoutes");
const serviceRoutes = require("./ServiceRoutes");
const businessRoutes = require("./BusinessRoutes");
const bookingRoutes=require('./BookingRoutes')
const cardRoutes= require('./CardRoutes')
const planRoutes= require('./planRoutes')


router.use("/api", authRoutes);
router.use("/api", serviceRoutes);
router.use("/api", businessRoutes);
router.use('/api', bookingRoutes)
router.use('/api', cardRoutes)
router.use('/api', planRoutes)


module.exports = router;
