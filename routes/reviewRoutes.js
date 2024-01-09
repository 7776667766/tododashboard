const router = require("express").Router();
const {
  getAllReviews,
} = require("../controllers/reviewsController");

router.get("/reviews/get", getAllReviews);

module.exports = router;
