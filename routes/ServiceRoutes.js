const router = require("express").Router();
const {
  addServiceApi,
  addServiceTypeApi,
  getServicesApi,
  getServiceDetailByIdApi,
  getAllServicesTypeApi,
  updateServiceApi,
} = require("../controllers/ServiceController");
const auth = require("../middlewares/auth");

router.post("/services/types/add", auth, addServiceTypeApi);
router.get("/services/types", getAllServicesTypeApi);
router.post("/services/add", auth, addServiceApi);
router.post("/services/update/:serviceId", auth, updateServiceApi);
router.post("/services/all-services", auth, getServicesApi);
router.get("/services/detail/:id", auth, getServiceDetailByIdApi);

module.exports = router;
