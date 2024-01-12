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
  getAllServicesApi,
  updateServiceTypeApi,
  deleteServicTypeApi,
} = require("../controllers/ServiceController");
const auth = require("../middlewares/auth");
const upload = require("../middlewares/uploadImage");

// Service Types Routes
router.get("/services/types", getAllServicesTypeApi);

router.post(
  "/services/types/add",
  auth,
  upload("service/service-type").single("image"),
  addServiceTypeApi
);
router.post(
  "/servicestype/update/:serviceTypeId",
  auth,
  upload("service/service-type").single("image"),
  updateServiceTypeApi
);
router.get("/servicetype/delete/:serviceTypeId", deleteServicTypeApi);

// Services Routes
router.post("/services/all-services", getServicesApi);
router.get("/services/get-all-services", getAllServicesApi);

router.post(
  "/services/add",
  auth,
  upload("service").single("image"),
  addServiceApi
);

router.post(
  "/services/update/:serviceId",
  auth,
  upload("service").single("image"),
  updateServiceApi
);
router.get("/services/delete/:serviceId", deleteServiceApi);

router.get("/services/detail/:slug", getServiceDetailBySlugApi);

router.post("/services/all-dummy-services", getDummyServicesApi);
router.post(
  "/services/dummyadd",
  auth,
  upload("service").single("image"),
  addDummyServiceApi
);

module.exports = router;
