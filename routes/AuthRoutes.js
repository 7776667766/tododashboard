const {
  loginApi,
  registerApi,
  verifyOtpApi,
  userProfileApi,
  forgetPasswordApi,
} = require("../controllers/AuthController");
const router = require("express").Router();
const auth = require("../middlewares/auth");

router.post("/auth/login", loginApi);
router.post("/auth/register", registerApi);
router.post("/auth/verify-otp", verifyOtpApi);
router.post("/auth/forget-password", forgetPasswordApi);
router.get("/get-user-profile/", auth, userProfileApi);

module.exports = router;
