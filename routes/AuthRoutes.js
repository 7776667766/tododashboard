const {
  loginApi,
  registerApi,
  verifyOtpApi,
  forgetPasswordApi,
  resetPasswordApi,
  changePasswordApi,
  getUserProfileApi,
  updataUserProfileApi,
  logoutApi,
  getAllUsersApi,
} = require("../controllers/AuthController");
const router = require("express").Router();
const auth = require("../middlewares/auth");
const upload =require("../middlewares/uploadImage")

router.post("/auth/login", loginApi);
router.post("/auth/register", upload.single('image'), registerApi);
router.post("/auth/verify-otp", verifyOtpApi);
router.post("/auth/forget-password", forgetPasswordApi);
router.post("/auth/reset-password", resetPasswordApi);
router.post("/change-password", auth, changePasswordApi);
router.get("/auth/logout", auth, logoutApi);
router.get("/get-user-profile", auth, getUserProfileApi);
router.post("/update-user-profile", auth, upload.single('image'), updataUserProfileApi);
router.get("/all-users", auth, getAllUsersApi);

module.exports = router;
