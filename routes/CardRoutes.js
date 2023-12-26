const router = require("express").Router();
// const auth = require("../middlewares/auth");

const {
  addCardApi, 
} = require("../controllers/CardController");

router.post("/card/add", addCardApi);

module.exports = router;