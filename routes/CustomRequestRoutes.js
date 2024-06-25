const router = require("express").Router();
const {
    addBusinessApi,
    getbusinessRequest,
} = require("../controllers/BusinessRequestController");


router.post("/request-send/add", addBusinessApi);

router.get("/request-send/get", getbusinessRequest)

module.exports = router;
