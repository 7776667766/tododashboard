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
        title: "Review 1",
        description: "fine service really impressive.",
        rating: 3.5,
        image: "https://tse2.mm.bing.net/th?id=OIP.C_1j1Nk5UHp71WwaL4ATqQHaEr&pid=Api&P=0&h=220",
        deletedAt: null,
      },
      {
        title: "Review 2",
        description: "This is a test review 2.",
        rating: 4.0,
        image: "https://tse4.mm.bing.net/th?id=OIP.JJSXln3GIWyOc-6W7newEAHaEN&pid=Api&P=0&h=220",
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

