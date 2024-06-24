const router = require("express").Router();
const {
    addBusinessApi,
} = require("../controllers/BusinessRequestController");


router.post("/request-send/add", addBusinessApi);

module.exports = router;
