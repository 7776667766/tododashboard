const router = require("express").Router();
const authRoutes = require("./AuthRoutes");
const serviceRoutes = require("./ServiceRoutes");
const businessRoutes = require("./BusinessRoutes");
const bookingRoutes=require('./BookingRoutes')
const cardRoutes= require('./TransactionRoutes')
const planRoutes= require('./planRoutes')
const transactionRoutes= require('./TransactionRoutes')
const templateRoutes= require('./TemplateRoutes')



router.use("/api", authRoutes);
router.use("/api", serviceRoutes);
router.use("/api", businessRoutes);
router.use('/api', bookingRoutes)
router.use('/api', cardRoutes)
router.use('/api', planRoutes)
router.use('/api', transactionRoutes)
router.use('/api', templateRoutes)

module.exports = router;
