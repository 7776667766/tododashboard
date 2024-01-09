const Review = require("../models/reviewModal");

const getAllReviews = (req, res) => {
    try {
      const dummyReviews = [
        {
          businessId: "603d7abb8a4ae83c19b9d58c",
          title: "Sample Review 1",
          description: "This is a test review 1.",
          rating: 3.5,
          image: "https://example.com/sample-image1.jpg",
          deletedAt: null,
        },
        {
          businessId: "603d7abb8a4ae83c19b9d58c",
          title: "Sample Review 2",
          description: "This is a test review 2.",
          rating: 4.0,
          image: "https://example.com/sample-image2.jpg",
          deletedAt: null,
        },
      ];
  
      res.status(200).json({
        status: "success",
        data: dummyReviews,
      });
    } catch (error) {
        console.log("Error in getting all review ", error);
        res.status(500).json({
          status: "error",
          message: error.message,
        });
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  module.exports = {
    getAllReviews,
  };
  

  module.exports = {
    getAllReviews,
  };