const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
    BusinessEditRequestApi,
    BusinessGetRequestApi,
    GetEditBusinessRequestApi
} = require("../controllers/BusinessController");
const upload = require("../middlewares/uploadImage");

router.post(
    "/business-edit-request", upload("business/gallery").fields([
        { name: "logo", maxCount: 1 },
        { name: "profileLogo", maxCount: 16 },
        { name: "files", maxCount: 12 }]), BusinessEditRequestApi);


router.get(
    "/business-get-edit-request" , BusinessGetRequestApi);


router.post(
    "/get-edit-business-by-id-request" , GetEditBusinessRequestApi);


    


module.exports = router;
