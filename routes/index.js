// const router = require("express").Router();
// const authRoutes = require("./AuthRoutes");
// const serviceRoutes = require("./ServiceRoutes");
// const businessRoutes = require("./BusinessRoutes");
// const bookingRoutes = require("./BookingRoutes");
// const cardRoutes = require("./TransactionRoutes");
// const planRoutes = require("./PlanRoutes");
// const transactionRoutes = require("./TransactionRoutes");
// const templateRoutes = require("./TemplateRoutes");
// const reviewRoutes = require("./ReviewRoutes");
// const contactRoutes = require("./ContactRoutes");

// router.use("/api", authRoutes);
// router.use("/api", serviceRoutes);
// router.use("/api", businessRoutes);
// router.use("/api", bookingRoutes);
// router.use("/api", cardRoutes);
// router.use("/api", planRoutes);
// router.use("/api", transactionRoutes);
// router.use("/api", templateRoutes);
// router.use("/api", reviewRoutes);
// router.use("/api", contactRoutes);

// module.exports = router;


const router = require("express").Router();

const todosRoutes = require("./TodoRoutes");
const AuthRoutes = require("./AuthRoutes");

router.use("/api", todosRoutes);
router.use("/api", AuthRoutes);

module.exports = router;
