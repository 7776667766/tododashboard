// const Review = require("../models/reviewModal");
// const axios = require('axios');
// const puppeteer = require('puppeteer');

// async function scrapeBusinessInfo(url) {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     await page.goto(url);

//     await page.waitForSelector('h1');
//     await page.waitForSelector('.section-star-display');
//     await page.waitForSelector('.widget-pane-link');

//     const businessName = await page.$eval('h1', element => element.textContent.trim());
//     const rating = await page.$eval('.section-star-display', element => element.textContent.trim());
//     const numReviews = await page.$eval('.widget-pane-link', element => element.textContent.trim());
//     const category = await page.$eval('.widget-pane-link', element => element.textContent.trim());

//     console.log("Business Name:", businessName);
//     console.log("Rating:", rating);
//     console.log("Number of Reviews:", numReviews);
//     console.log("Category:", category);

//     await browser.close();
// }

// const url = 'https://www.google.com/maps/place/Massage+Envy/@28.4823101,-81.5046458,11z/data=!4m10!1m2!2m1!1smassage+envy+orlando!3m6!1s0x88e77b74af2ff56f:0xfe39ab793ddbce80!8m2!3d28.515467!4d-81.378958!15sChRtYXNzYWdlIGVudnkgb3JsYW5kbyIDiAEBkgELbWFzc2FnZV9zcGHgAQA!16s%2Fg%2F1tfv1ct3?entry=ttu';
// scrapeBusinessInfo(url);

   



// const getAllReviews = async (req, res) => {

//   try {
//       const url = "https://www.google.com/maps/place/Massage+Envy/@28.4823101,-81.5046458,11z/data=!4m10!1m2!2m1!1smassage+envy+orlando!3m6!1s0x88e77b74af2ff56f:0xfe39ab793ddbce80!8m2!3d28.515467!4d-81.378958!15sChRtYXNzYWdlIGVudnkgb3JsYW5kbyIDiAEBkgELbWFzc2FnZV9zcGHgAQA!16s%2Fg%2F1tfv1ct3?entry=ttu";
//       const reviews = await scrapeBusinessInfo(url);
//       console.log(reviews,"reviews")
//       res.status(200).json({
//           status: 'success',
//           data: reviews,
//       });
//   } catch (error) {
//       console.log('Error in getting all review ', error);
//       res.status(500).json({
//           status: 'error',
//           message: error.message,
//       });
//   }
// };


const getAllReviews = (req, res) => {
    const { businessId } = req.params;
    if (!businessId) {
      return res.status(400).json({
        status: "error",
        message: "BusinessId is required",
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
