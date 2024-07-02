const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
    requestAdminToRegister,
    getAdminRequestToRegisterBusiness,
} = require("../controllers/BusinessRequestController");
router.post("/request-admin-to-register-business", auth,requestAdminToRegister);
router.post("/get-admin-request-to-register-business", getAdminRequestToRegisterBusiness)
module.exports = router;