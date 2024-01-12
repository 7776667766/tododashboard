const Review = require("../models/reviewModal");

const getAllReviews = (req, res) => {
  const { businessId } = req.params;
  if (!businessId) {
    return res.status(400).json({
      status: "error",
      message: "Business id is required",
    });
  }
  try {
    const myReviews = [
      {
        name: "Review 1",
        message: "fine service really impressive.",
        rating: 3.5,
        image:
          "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg",
        deletedAt: null,
      },
      {
        name: "Review 2",
        message: "This is a test review 2.",
        rating: 4.0,
        image:
          "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg",
        deletedAt: null,
      },
    ];

    res.status(200).json({
      status: "success",
      data: myReviews,
    });
  } catch (error) {
    console.log("Error in getting all review ", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getAllReviews,
};
