const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  addPlanApi,
  getBusinessPlanListApi,
} = require("../controllers/PlanController");

router.post("/plan/add", auth, addPlanApi);
router.get("/plan/get", getBusinessPlanListApi);

module.exports = router;
