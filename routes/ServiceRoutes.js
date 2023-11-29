const router = require("express").Router();
const {
  addServiceApi,
  addServiceTypeApi,
} = require("../controllers/ServiceController");
const auth = require("../middlewares/auth");

router.post("/services/types/add", auth, addServiceTypeApi);
router.post("/services/add", auth, addServiceApi);

module.exports = router;
