const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
    BusinessEditRequestApi,
} = require("../controllers/BusinessController");
const upload = require("../middlewares/uploadImage");

router.post(
    "/business-edit-request", upload("business/gallery").fields([
        { name: "logo", maxCount: 1 },
        { name: "profileLogo", maxCount: 16 },
        { name: "files", maxCount: 12 }]), BusinessEditRequestApi );

module.exports = router;
