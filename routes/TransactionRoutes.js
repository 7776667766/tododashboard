const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  addTransactionApi,
  getTransactionbyUserId,
  addTranstactionWithCreditAmount,
  getTransactionbyCardbyUserId,
} = require("../controllers/TransactionController");

router.post("/transaction/add", auth, addTransactionApi);
router.get("/transaction/get", auth, getTransactionbyUserId);
router.post("/add-transaction-by-credit-amount", auth, addTranstactionWithCreditAmount);
router.get("/get-transaction-by-credit-amount", auth, getTransactionbyCardbyUserId);


module.exports = router;