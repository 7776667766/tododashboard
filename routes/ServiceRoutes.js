const router = require("express").Router();
const { addServiceApi } = require("../controllers/ServiceController");
const auth = require("../middlewares/auth");

router.post("/services/add", auth, addServiceApi);

module.exports = router;
