const router = require("express").Router();
const {
  addServiceApi,
  addServiceTypeApi,
  getServicesApi,
  getServiceDetailBySlugApi,
  getAllServicesTypeApi,
  updateServiceApi,
  addDummyServiceApi,
  getDummyServicesApi,
  deleteServiceApi,
  updateServiceTypeApi,
  deleteServicTypeApi,
} = require("../controllers/ServiceController");
const auth = require("../middlewares/auth");
const upload = require("../middlewares/uploadImage");

router.post("/services/types/add", auth, upload("service").single("image"), addServiceTypeApi);
router.get("/services/types", getAllServicesTypeApi);
router.get("/servicetype/delete/:serviceId", deleteServicTypeApi);

router.post(
  "/services/add",
  auth,
  upload("service").single("image"),
  addServiceApi
);
// updateServiceTypeApi

router.post("/services/update/:serviceId", auth, upload("service").single("image"),
  updateServiceApi);
router.post("/services/all-services", getServicesApi);
router.get("/services/detail/:slug", getServiceDetailBySlugApi);
router.get("/services/delete/:serviceId", deleteServiceApi);
router.post("/services/all-dummy-services", getDummyServicesApi);
router.post(
  "/services/dummyadd",
  auth,
  upload("serviceType").single("image"),
  addDummyServiceApi
)
router.post("/servicestype/update/:id", auth ,upload("service").single("image"),
updateServiceTypeApi);

module.exports = router;
