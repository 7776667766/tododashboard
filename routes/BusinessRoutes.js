const router = require("express").Router();
const auth = require("../middlewares/auth");
const { addSpecialistApi } = require("../controllers/BusinessController");

router.post("/specialist/add", auth, addSpecialistApi);

module.exports = router;
