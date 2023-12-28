const router = require("express").Router();

const {
  addCardApi, 
  getTransactionDetails
} = require("../controllers/CardController");

router.post("/card/add", addCardApi);
router.get("/transaction/get", getTransactionDetails);

module.exports = router;