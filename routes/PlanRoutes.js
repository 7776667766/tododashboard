const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  addPlanApi,
  getBusinessPlanListApi,
  deletePlanApi,
  updatePlanApi
} = require("../controllers/PlanController");

router.post("/plan/add", auth, addPlanApi);
router.get("/plan/get", getBusinessPlanListApi);
router.get("/plan/delete/:planId", deletePlanApi);

router.post(
  "/plan/update/:planId", updatePlanApi);

module.exports = router;
