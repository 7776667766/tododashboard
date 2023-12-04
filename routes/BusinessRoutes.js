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
} = require("../controllers/BusinessController");

router.post("/specialist/add", auth, addSpecialistApi);
router.get("/specialist/:businessId", auth, getSpecialistByBusinessIdApi);
router.post("/manager/add", auth, addManagerApi);
router.post("/manager/update/:managerId", auth, updateManagerApi);
router.get("/manager/delete/:managerId", auth, deleteManagerApi);
router.get("/manager/:businessId", auth, getManagersByBusinessIdApi);
router.post("/register-business", auth, registerBusinessApi);
router.get("/business/get-my-business-list", auth, getBusinessByUserIdApi);

module.exports = router;
