const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  addCardApi, 
  getTransactionbyUserId} = require("../controllers/CardController");

router.post("/card/add", auth, addCardApi);
router.get("/transaction/get",auth, getTransactionbyUserId);

module.exports = router;