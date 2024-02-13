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
      {
        name: "Review 3",
        message: "fine service really impressive.",
        rating: 3.5,
        image:
          "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg",
        deletedAt: null,
      },
      {
        name: "Review 4",
        message: "This is a test review 2.",
        rating: 4.0,
        image:
          "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg",
        deletedAt: null,
      },
      {
        name: "Review 5",
        message: "fine service .",
        rating: 1.5,
        image:
          "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg",
        deletedAt: null,
      },
      {
        name: "Review 6",
        message: "This is a test review 2.",
        rating: 2.5,
        image:
          "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg",
        deletedAt: null,
      },
      {
        name: "Review 7",
        message: "fine service really impressive.",
        rating: 3.5,
        image:
          "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg",
        deletedAt: null,
      },
      {
        name: "Review 8",
        message: "This is a test review 2.",
        rating: 4.0,
        image:
          "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg",
        deletedAt: null,
      },
      {
        name: "Review 9",
        message: "This is a test review 2.",
        rating: 2.0,
        image:
          "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg",
        deletedAt: null,
      },
      {
        name: "Review 10",
        message: "This is a test review 2.",
        rating: 5.0,
        image:
          "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg",
        deletedAt: null,
      },
      {
        name: "Review 11",
        message: "This is a test review 2.",
        rating: 3.0,
        image:
          "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg",
        deletedAt: null,
      },
      {
        name: "Review 12",
        message: "This is a test review 2.",
        rating: 2.0,
        image:
          "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg",
        deletedAt: null,
      },
      {
        name: "Review 13",
        message: "This is a test review 2.",
        rating: 1.0,
        image:
          "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg",
        deletedAt: null,
      },
      {
        name: "Review 14",
        message: "This is a test review 2.",
        rating: 3.0,
        image:
          "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg",
        deletedAt: null,
      },
      {
        name: "Review 15",
        message: "This is a test review 2.",
        rating: 2.0,
        image:
          "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg",
        deletedAt: null,
      },
      {
        name: "Review 16",
        message: "This is a test review 2.",
        rating: 5.0,
        image:
          "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg",
        deletedAt: null,
      },
      {
        name: "Review 17",
        message: "This is a test review 2.",
        rating: 2.0,
        image:
          "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg",
        deletedAt: null,
      },
      {
        name: "Review 18",
        message: "This is a test review 2.",
        rating: 3.5,
        image:
          "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg",
        deletedAt: null,
      },
      {
        name: "Review 19",
        message: "This is a test review 2.",
        rating: 3.0,
        image:
          "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg",
        deletedAt: null,
      },
      {
        name: "Review 20",
        message: "This is a test review 2.",
        rating: 4.0,
        image:
          "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg",
        deletedAt: null,
      },
      {
        name: "Review 21",
        message: "This is a test review 2.",
        rating: 4.0,
        image:
          "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg",
        deletedAt: null,
      },
      {
        name: "Review 22",
        message: "This is a test review 2.",
        rating: 4.0,
        image:
          "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg",
        deletedAt: null,
      },
      {
        name: "Review 23",
        message: "This is a test review 2.",
        rating: 4.0,
        image:
          "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg",
        deletedAt: null,
      },
      {
        name: "Review 24",
        message: "This is a test review 2.",
        rating: 4.0,
        image:
          "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg",
        deletedAt: null,
      },
      {
        name: "Review 25",
        message: "This is a test review 2.",
        rating: 4.0,
        image:
          "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg",
        deletedAt: null,
      },
      {
        name: "Review 26",
        message: "This is a test review 2.",
        rating: 4.0,
        image:
          "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg",
        deletedAt: null,
      },
      {
        name: "Review 27",
        message: "This is a test review 2.",
        rating: 4.0,
        image:
          "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg",
        deletedAt: null,
      },
      {
        name: "Review 28",
        message: "This is a test review 2.",
        rating: 4.0,
        image:
          "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg",
        deletedAt: null,
      },
      {
        name: "Review 29",
        message: "This is a test review 2.",
        rating: 4.0,
        image:
          "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg",
        deletedAt: null,
      },
      {
        name: "Review 30",
        message: "This is a test review 2.",
        rating: 4.0,
        image:
          "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg",
        deletedAt: null,
      },
      {
        name: "Review 31",
        message: "This is a test review 2.",
        rating: 4.0,
        image:
          "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg",
        deletedAt: null,
      },
      {
        name: "Review 32",
        message: "This is a test review 2.",
        rating: 4.0,
        image:
          "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg",
        deletedAt: null,
      },
      {
        name: "Review 33",
        message: "This is a test review 2.",
        rating: 4.0,
        image:
          "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg",
        deletedAt: null,
      },
      {
        name: "Review 34",
        message: "This is a test review 2.",
        rating: 4.0,
        image:
          "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg",
        deletedAt: null,
      },
    
      // {
      //   name: "Review 3",
      //   message: "not bad.",
      //   rating: 2.0,
      //   image:
      //     "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg",
      //   deletedAt: null,
      // },
      // {
      //   name: "Review 4",
      //   message: "This is a test review 2.",
      //   rating: 4.0,
      //   image:
      //     "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg",
      //   deletedAt: null,
      // },
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
