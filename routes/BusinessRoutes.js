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
  updateSpecialsitApi,
  deleteSpecialistApi,
  getBusinessByServiceType,
  showAllBusinessApi
} = require("../controllers/BusinessController");
const upload = require("../middlewares/uploadImage");

router.post("/specialist/add", auth, addSpecialistApi);
router.get("/specialist/delete/:specilaistId", deleteSpecialistApi);

router.post(
  "/specialist/update/:specialistId", updateSpecialsitApi);

router.get(
  "/show-all-business-api",
  showAllBusinessApi
);
router.get("/specialist/:businessId", auth, getSpecialistByBusinessIdApi);
router.post("/manager/add", auth, addManagerApi);
// router.post("/manager/update/:managerId", auth, updateManagerApi);
router.get("/manager/delete/:managerId", auth, deleteManagerApi);
router.get("/manager/:businessId", auth, getManagersByBusinessIdApi);
router.get(
  "/business-by-service-type/:serviceTypeSlug",
  getBusinessByServiceType
);

router.post(
  "/register-business",
  auth,
  upload("business").single("logo"),
  registerBusinessApi
);
router.get("/business/get-all-business", getAllBusinessApi);
router.get("/business/get-my-business-list", auth, getBusinessByUserIdApi);
router.get("/business/get-business-detail/:slug", getBusinessDetailBySlugApi);
router.post(
  "/theme/theme-Api",
  auth,
  upload("business/banners").single("bannerImg"),
  selectedTheme
);


router.post(
  "/add-dummy-business",
  auth,
  upload("business").fields([
    { name: "logo", maxCount: 1 },
    { name: "bannerImg", maxCount: 1 },
  ]),
  addDummyBusinessApi
);

module.exports = router;
