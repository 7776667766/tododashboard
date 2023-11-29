const router = require("express").Router();
const auth = require("../middlewares/auth");
const { addEmployeeApi } = require("../controllers/BusinessController");

router.post("/employee/add", auth, addEmployeeApi);

module.exports = router;
