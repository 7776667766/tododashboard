const router = require("express").Router();
const {
  addServiceApi,
  addServiceTypeApi,
  getServicesApi,
} = require("../controllers/ServiceController");
const auth = require("../middlewares/auth");

router.post("/services/types/add", auth, addServiceTypeApi);
router.post("/services/add", auth, addServiceApi);
router.post("/services/get-business-services", auth, getServicesApi);

module.exports = router;
