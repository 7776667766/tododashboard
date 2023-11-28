const {
  loginApi,
  registerApi,
  verifyOtpApi,
  userProfileApi,
} = require("../controllers/AuthController");
const router = require("express").Router();

router.post("/auth/login", loginApi);
router.post("/auth/register", registerApi);
router.post("/auth/verify-otp", verifyOtpApi);
router.get("/get-user-profile/:id", userProfileApi);

module.exports = router;
