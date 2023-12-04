const router = require("express").Router();
const authRoutes = require("./AuthRoutes");
const serviceRoutes = require("./ServiceRoutes");
const businessRoutes = require("./BusinessRoutes");

router.use("/api", authRoutes);
router.use("/api", serviceRoutes);
router.use("/api", businessRoutes);

module.exports = router;
