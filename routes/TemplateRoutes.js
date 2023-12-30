const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  addTemplateApi, 
} = require("../controllers/TemplateController");

router.post("/template/add", auth, addTemplateApi);
// router.get("/template/get",auth, getTepmlateApi);

module.exports = router;