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
  deleteServiceApi
} = require("../controllers/ServiceController");
const auth = require("../middlewares/auth");
const upload = require("../middlewares/uploadImage");

router.post("/services/types/add", auth, addServiceTypeApi);
router.get("/services/types", getAllServicesTypeApi);
router.post(
  "/services/add",
  auth,
  upload("service").single("image"),
  addServiceApi
);
router.post("/services/update/:serviceId", auth, upload("service").single("image"),
  updateServiceApi);
router.post("/services/all-services", getServicesApi);
router.get("/services/detail/:slug", getServiceDetailBySlugApi);
router.get("/services/delete/:serviceId", deleteServiceApi);
router.post("/services/all-dummy-services", getDummyServicesApi);
router.post(
  "/services/dummyadd",
  auth,
  upload("service").single("image"),
  addDummyServiceApi
)


module.exports = router;
