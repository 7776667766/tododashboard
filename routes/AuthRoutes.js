const {
  Login,
  Register,
  loginApi,
  registerApi,
  verifyOtpApi,
} = require("../controllers/AuthController");
const router = require("express").Router();

router.post("/login", loginApi);
router.post("/register", registerApi);
router.post("/verify-otp", verifyOtpApi);

module.exports = router;
