const router = require("express").Router();
const { getAllReviews } = require("../controllers/ReviewsController");

router.get("/reviews/get:businessId", getAllReviews);

module.exports = router;
