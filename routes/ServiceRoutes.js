const router = require("express").Router();
const {
  addServiceApi,
  addServiceTypeApi,
  getServicesApi,
  getServiceDetailApi,
} = require("../controllers/ServiceController");
const auth = require("../middlewares/auth");

router.post("/services/types/add", auth, addServiceTypeApi);
router.post("/services/add", auth, addServiceApi);
router.post("/services/get-business-services", auth, getServicesApi);
router.get("/services/detail/:id", auth, getServiceDetailApi);

module.exports = router;
