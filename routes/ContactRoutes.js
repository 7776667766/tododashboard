const router = require("express").Router();
const {
    addContactApi,
    getContactListApi,
} = require("../controllers/ContactController");

router.post("/contact/add", addContactApi);
router.get("/contact/get", getContactListApi);

module.exports = router;
