const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
    addPlanApi,
    getPlanbyAdminId
} = require("../controllers/PlanController");

router.post("/plan/add", auth, addPlanApi);
router.get("/plan/get", getPlanbyAdminId);

module.exports = router;