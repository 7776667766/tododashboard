const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  addSpecialistApi,
  getSpecialistByBusinessIdApi,
  addManagerApi,
  deleteManagerApi,
  updateManagerApi,
  getManagersByBusinessIdApi,
  handleCancelBusinessApi,
  registerBusinessApi,
  getBusinessByUserIdApi,
  getBusinessDetailBySlugApi,
  selectedTheme,
  addDummyBusinessApi,
  getAllBusinessApi,
  updateSpecialsitApi,
  customizeThemeApi,
  // getBusinessBybusinessIdApi,
  getBusinessByOwnerIdApi,
  deleteSpecialistApi,
  getBusinessByServiceType,
  updateBusinessApi,
  handleCustomBusinessApi,
  showAllBusinessApi
} = require("../controllers/BusinessController");
const upload = require("../middlewares/uploadImage");

router.post("/specialist/add", auth, addSpecialistApi);
router.get("/specialist/delete/:specilaistId", deleteSpecialistApi);

router.post(
  "/specialist/update/:specialistId", updateSpecialsitApi);

  
router.post(
  "/business-update" , upload("business/gallery").fields([
    { name: "logo", maxCount: 1 },
    { name: "profileLogo", maxCount: 16},
    { name: "files", maxCount: 12 }]), updateBusinessApi);


router.get(
  "/show-all-business-api",
  showAllBusinessApi
);
router.get("/business-by-ownerId", auth,  getBusinessByOwnerIdApi);

router.get("/specialist/:businessId", auth, getSpecialistByBusinessIdApi);
router.post("/manager/add", auth, addManagerApi);
router.post("/manager/update/:managerId", auth, updateManagerApi);
router.get("/manager/delete/:managerId", auth, deleteManagerApi);
router.get("/manager/:businessId", auth, getManagersByBusinessIdApi);
router.post(
  "/business-by-service-type/",
  getBusinessByServiceType
);


router.post("/register-business", upload("business/gallery").fields([
  { name: "logo", maxCount: 1 },
  { name: "profileLogo", maxCount: 16},
  { name: "files", maxCount: 12 }]), auth, registerBusinessApi);



router.get("/business/get-all-business", getAllBusinessApi);
router.post("/business/get-my-business-list/", auth, getBusinessByUserIdApi);
router.get("/business/get-business-detail/:slug", getBusinessDetailBySlugApi);
router.post(
  "/theme/theme-Api",
  auth,
  upload("business/banners").single("bannerImg"),
  selectedTheme
);


router.post(
  "/business/custom-business",
  auth,
  handleCustomBusinessApi
);
router.post(
  "/business/custom-business-cancelled",
  auth,
  handleCancelBusinessApi
);

router.post(
  "/theme/customize-theme",
  auth,
  upload("business/banners").single("bannerImg"),
  customizeThemeApi
);

router.post(
  "/add-dummy-business",
  auth,
  upload("business/gallery").fields([
    { name: "logo", maxCount: 1 },
    { name: "profileLogo", maxCount: 16},
    { name: "files", maxCount: 12 }]),
  addDummyBusinessApi
);

module.exports = router;
