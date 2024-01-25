const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  addTransactionApi,
  getTransactionbyUserId
} = require("../controllers/TransactionController");

router.post("/transaction/add", auth, addTransactionApi);
router.get("/transaction/get", auth, getTransactionbyUserId);

module.exports = router;