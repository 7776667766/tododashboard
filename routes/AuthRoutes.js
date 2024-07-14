const {
    loginApi,
    registerApi,  
    logoutApi,
    checkTokenIsValidApi,
  } = require("../controllers/AuthController");
  const router = require("express").Router();
  const auth = require("../middlewares/auth");

  router.post("/auth/login", loginApi);
  router.post("/auth/register", registerApi);
  router.get("/auth/token-is-valid", auth, checkTokenIsValidApi);
  router.get("/auth/logout", auth, logoutApi);
  
  module.exports = router;