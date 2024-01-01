const router = require("express").Router();
const auth = require("../middlewares/auth");
const upload = require("../middlewares/uploadImage");

const {
  addTemplateApi,
  getTepmlateApi
} = require("../controllers/TemplateController");

router.post("/template/add", upload("template").fields([
  { name: "websiteImage", maxCount: 1 },
  { name: "bookingImage", maxCount: 1 }]), auth, addTemplateApi);
router.get("/template/get", getTepmlateApi)

module.exports = router;