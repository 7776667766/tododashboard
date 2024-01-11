const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  addSpecialistApi,
  getSpecialistByBusinessIdApi,
  addManagerApi,
  deleteManagerApi,
  updateManagerApi,
  getManagersByBusinessIdApi,
  registerBusinessApi,
  getBusinessByUserIdApi,
  getBusinessDetailBySlugApi,
  selectedTheme,
  addDummyBusinessApi,
  getAllBusinessApi,
} = require("../controllers/BusinessController");
const upload = require("../middlewares/uploadImage");

router.post("/specialist/add", auth, addSpecialistApi);
router.get("/specialist/:businessId", auth, getSpecialistByBusinessIdApi);
router.post("/manager/add", auth, addManagerApi);
router.post("/manager/update/:managerId", auth, updateManagerApi);
router.get("/manager/delete/:managerId", auth, deleteManagerApi);
router.get("/manager/:businessId", auth, getManagersByBusinessIdApi);
router.post(
  "/register-business",
  auth,
  upload("business").single("logo"),
  registerBusinessApi
);
router.get("/business/get-all-business", getAllBusinessApi);
router.get("/business/get-my-business-list", auth, getBusinessByUserIdApi);
router.get("/business/get-business-detail/:slug", getBusinessDetailBySlugApi);
router.post("/theme/theme-Api", auth, selectedTheme);
router.post(
  "/add-dummy-business",
  auth,
  upload("business").single("logo"),
  addDummyBusinessApi
);

module.exports = router;
