const router = require("express").Router();
const {
    requestAdminToRegister,
    getAdminRequestToRegisterBusiness,
} = require("../controllers/BusinessRequestController");


router.post("/request-admin-to-register-business", requestAdminToRegister);

router.post("/get-admin-request-to-register-business", getAdminRequestToRegisterBusiness)

module.exports = router;
