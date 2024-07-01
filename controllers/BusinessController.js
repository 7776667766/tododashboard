const validator = require("validator");
const User = require("../models/UserModel");
const Manager = require("../models/ManagerModel");
const Specialist = require("../models/SpecialistModel");
const Business = require("../models/BusinessModal");
const BusinesseditRequest = require("../models/RequestEditModal")
// const slugify = require("slugify");
const { sendEmail } = require("../util/sendEmail");
const imgFullPath = require("../util/imgFullPath");
const Owner = require("../models/OwnerModel");
const Service = require("../models/Service/ServiceModel");
const ServiceType = require("../models/Service/ServiceTypeModel");
const path = require("path");
const Transaction = require("../models/TransactionModel");
const { makelyLogo, circleTickImg } = require("../util/assets");

const addSpecialistApi = async (req, res) => {
  try {
    if (req.user === undefined) {
      return res.status(400).json({ status: "error", message: "Invalid user" });
    }
    const { id } = req.user;
    const { name, email, businessId } = req.body;

    if (!name || !email || !businessId) {
      return res.status(400).json({
        status: "error",
        message: "All fields are required",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        status: "error",
        message: "Email is invalid",
      });
    }

    if (!validator.isMongoId(businessId)) {
      return res.status(400).json({
        status: "error",
        message: "Business Id is invalid",
      });
    }

    const user = await User.findById(id);
    console.log("user 44 line", user);

    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "User not found",
      });
    }

    if (user.role === "user") {
      return res.status(400).json({
        status: "error",
        message: "You are not authorized to add specialist",
      });
    }

    const isAlreadySpecialistExist = await Specialist.findOne({ email });
    if (isAlreadySpecialistExist) {
      return res.status(400).json({
        status: "error",
        message: "Specialist email already exists",
      });
    }

    const newSpecialist = await Specialist.create({
      name,
      email,
      businessId,
    });

    res.status(200).json({
      status: "success",
      data: {
        id: newSpecialist._id,
        name: newSpecialist.name,
        email: newSpecialist.email,
      },
      message: "Specialist Added Successfully",
    });
  } catch (error) {
    console.log("Error in add specialist", error);
    res.status(400).json({ status: "error", message: error.message });
  }
};

const getSpecialistByBusinessIdApi = async (req, res, next) => {
  try {
    const { businessId } = req.params;
    if (!businessId) {
      return res.status(400).json({
        status: "error",
        message: "Business Id is required",
      });
    }
    if (!validator.isMongoId(businessId)) {
      return res.status(400).json({
        status: "error",
        message: "Business Id is invalid",
      });
    }
    const specialists = await Specialist.find({
      deletedAt: { $exists: false },
      businessId,
    }).select({
      _id: 0,
      id: {
        $toString: "$_id",
      },
      name: 1,
      email: 1,
    });
    res.status(200).json({
      status: "success",
      data: specialists,
    });
  } catch (error) {
    console.log("Error in Get Specialist", error);
    res.status(400).json({ status: "error", message: error.message });
  }
};

const addManagerApi = async (req, res) => {
  try {
    if (req.user === undefined) {
      return res.status(400).json({ status: "error", message: "Invalid user" });
    }
    const { id } = req.user;
    const { name, email, password, confirmPassword, phone, businessId } =
      req.body;
    if (
      !name ||
      !email ||
      !phone ||
      !password ||
      !confirmPassword ||
      !businessId
    ) {
      return res.status(400).json({
        status: "error",
        message: "All fields are required",
      });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        status: "error",
        message: "Email is invalid",
      });
    }
    if (!validator.isLength(password, { min: 8 })) {
      return res.status(400).json({
        status: "error",
        message: "Password must be atleast 8 characters long",
      });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({
        status: "error",
        message: "Password and confirm password must be same",
      });
    }
    if (!validator.isMongoId(businessId)) {
      return res.status(400).json({
        status: "error",
        message: "Business Id is invalid",
      });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "User not found",
      });
    }
    if (user.role !== "owner") {
      return res.status(400).json({
        status: "error",
        message: "You are not authorized to add manager",
      });
    }

    const isEmailExist = await User.findOne({ email });
    if (isEmailExist) {
      return res.status(400).json({
        status: "error",
        message: "Email already exists",
      });
    }

    const isPhoneExist = await User.findOne({ phone });
    if (isPhoneExist) {
      return res.status(400).json({
        status: "error",
        message: "Phone already exists",
      });
    }

    const newUser = await User.create({
      name,
      email,
      phone,
      password,
      role: "manager",
    });

    const newManager = await Manager.create({
      businessId,
      createdBy: id,
      managerId: newUser._id,
    });
    console.log("NEW MANAGER 214", newManager);

    res.status(200).json({
      status: "success",
      data: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
      },
      message: "Manager added successfully",
    });
  } catch (error) {
    console.log("Error in add manager", error);
    res.status(400).json({ status: "error", message: error.message });
  }
};
// const updateManagerApi = async (req, res) => {
//   try {
//     if (req.user === undefined) {
//       return res.status(400).json({ status: "error", message: "Invalid user" });
//     }

//     const { id } = req.params;
//     const { managerId } = req.params;
//     const { name, email, code, number } = req.body;

//     if (!name && !email && !countryCode && !phoneNumber) {
//       return res.status(400).json({
//         status: "error",
//         message: "At least one of name, email, country code, or phone number is required to update",
//       });
//     }

//     if (!validator.isMongoId(managerId)) {
//       return res.status(400).json({
//         status: "error",
//         message: "Invalid manager ID",
//       });
//     }

//     if (!validator.isEmail(email)) {
//       return res.status(400).json({
//         status: "error",
//         message: "Email is invalid",
//       });
//     }

//     // Optional: Phone number validation using phone-number library
//     // const phoneNumberUtil = require('phone-number');
//     // const parsedNumber = phoneNumberUtil.parse(phoneNumber + '', 'US');  // Replace 'US' with the appropriate country code
//     // if (!phoneNumberUtil.isValidNumber(parsedNumber)) {
//     //   return res.status(400).json({
//     //     status: "error",
//     //     message: "Invalid phone number format",
//     //   });
//     // }

//     const manager = await User.findById(managerId);
//     if (!manager) {
//       return res.status(400).json({
//         status: "error",
//         message: "Manager not found",
//       });
//     }

//     if (manager.role !== "manager") {
//       return res.status(400).json({
//         status: "error",
//         message: "User is not a manager",
//       });
//     }

//     if (id !== manager.createdBy && req.user.role !== "owner") {
//       return res.status(400).json({
//         status: "error",
//         message: "You are not authorized to update this manager",
//       });
//     }

//     const updatedFields = {
//       ...(Object.keys(req.body).length > 0 ? req.body : {}), // Include only non-empty properties
//       // phone: {
//       //   code,
//       //   number,
//       // },
//     };

//     console.log("updated fields are ", updatedFields);
//     await User.findByIdAndUpdate(managerId, updatedFields);

//     res.status(200).json({
//       status: "success",
//       data: updatedFields,
//       message: "Manager updated successfully",
//     });
//   } catch (error) {
//     console.log("Error in update manager", error);
//     res.status(400).json({ status: "error", message: error.message });
//   }
// };
const updateManagerApi = async (req, res) => {
  try {
    if (req.user === undefined) {
      return res.status(400).json({ status: "error", message: "Invalid user" });
    }

    const { id } = req.user;
    const { managerId } = req.params;
    console.log("first manager id is ", managerId);
    const { name, email, phone } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        status: "error",
        message: "name, email, and phone are required",
      });
    }

    if (!validator.isMongoId(managerId)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid manager ID",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        status: "error",
        message: "Email is invalid",
      });
    }

    const manager = await User.findById(managerId);
    console.log("manager id is ", manager);
    if (!manager) {
      return res.status(400).json({
        status: "error",
        message: "Manager not found",
      });
    }

    if (manager.role !== "manager") {
      return res.status(400).json({
        status: "error",
        message: "User is not a manager",
      });
    }

    const updatedFields = {
      name,
      email,
      phone,
      // ...req.body
    };

    console.log("updated fields are ", updatedFields);
    await User.findByIdAndUpdate(managerId, updatedFields);

    res.status(200).json({
      status: "success",
      data: updatedFields,
      message: "Manager updated successfully",
    });
  } catch (error) {
    console.log("Error in update manager", error);
    res.status(400).json({ status: "error", message: error.message });
  }
};

const deleteSpecialistApi = async (req, res, next) => {
  try {
    const { specilaistId } = req.params;
    console.log("specilaistId", specilaistId);
    if (!specilaistId || !validator.isMongoId(specilaistId)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid plan ID",
      });
    }

    const specilaist = await Specialist.findById(specilaistId);
    console.log("specialist", specilaist);

    if (!specilaist) {
      return res.status(400).json({
        status: "error",
        message: "Specilaist not found",
      });
    }
    await Specialist.findByIdAndUpdate(
      { _id: specilaistId },
      { deletedAt: new Date() }
    );

    res.status(200).json({
      status: "success",
      message: "Specilaist deleted successfully",
    });
  } catch (error) {
    console.log("Error in Deleting Specilaist", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const updateSpecialsitApi = async (req, res, next) => {
  try {
    const { specialistId } = req.params;
    await Specialist.findOneAndUpdate(
      { _id: specialistId },
      {
        $set: {
          ...req.body,
        },
      },
      { new: true }
    );
    const mySpecialistData = await Specialist.findOne({ _id: specialistId });
    const mySpecialistUpdatedData = await getSpecialistData(mySpecialistData);

    res.status(200).json({
      status: "success",
      data: mySpecialistUpdatedData,
      message: "Specialist updated successfully",
    });
  } catch (error) {
    console.log("Error in update manager", error);
    res.status(400).json({ status: "error", message: error.message });
  }
};

const deleteManagerApi = async (req, res) => {
  try {
    if (req.user === undefined) {
      return res.status(400).json({ status: "error", message: "Invalid user" });
    }
    const { id } = req.user;
    const { managerId } = req.params;
    if (!managerId) {
      return res.status(400).json({
        status: "error",
        message: "Manager Id is required",
      });
    }

    if (!validator.isMongoId(managerId)) {
      return res.status(400).json({
        status: "error",
        message: "Manager Id is invalid",
      });
    }

    const manager = await Manager.findOne({ managerId });
    if (!manager) {
      return res.status(400).json({
        status: "error",
        message: "Manager not found",
      });
    }

    if (manager.createdBy.toString() !== id) {
      return res.status(400).json({
        status: "error",
        message: "You are not Authorized to delete this manager",
      });
    }
    await User.findByIdAndUpdate(manager.managerId, { deletedAt: new Date() });
    await Manager.findOneAndUpdate({ managerId }, { deletedAt: new Date() });
    res.status(200).json({
      status: "success",
      message: "Manager Deleted Successfully",
    });
  } catch (error) {
    console.log("Error in delete manager", error);
    res.status(400).json({ status: "error", message: error.message });
  }
};

const getManagersByBusinessIdApi = async (req, res, next) => {
  try {
    const { businessId } = req.params;
    if (!businessId) {
      return res.status(400).json({
        status: "error",
        message: "Business Id is required",
      });
    }

    if (!validator.isMongoId(businessId)) {
      return res.status(400).json({
        status: "error",
        message: "Business Id is invalid",
      });
    }
    const managers = await Manager.find({
      businessId,
      deletedAt: null || undefined,
    });
    const users = [];
    await Promise.all(
      managers.map(async (manager) => {
        const user = await User.findById(manager.managerId);
        users.push({
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
        });
      })
    );
    res.status(200).json({
      status: "success",
      data: users,
    });
  } catch (error) {
    console.log("Error in get manager", error);
    res.status(400).json({ status: "error", message: error.message });
  }
};

const registerBusinessApi = async (req, res) => {
  console.log(
    "Logo File:",
    req?.files["logo"] ? req.files["logo"][0]?.path : "No logo file uploaded"
  );
  console.log("other Files:", req.files["files"]);
  console.log("req body 384", req.body.reviews);
  try {
    if (req.user === undefined) {
      return res.status(400).json({ status: "error", message: "Invalid user" });
    }
    //for logo Image
    const logoImg = req?.files["logo"] ? req.files["logo"][0]?.path : null;

    //for Profile Image
    let ProfileImg = [];
    if (req.files["profileLogo"]) {
      req.files["profileLogo"].forEach((file) => {
        ProfileImg.push(file.path);
      });
    }
    console.log("ProfileImg:", ProfileImg);

    //for gallery Images Array
    let galleryImg = [];
    if (req.files["files"]) {
      req.files["files"].forEach((file) => {
        galleryImg.push(file.path);
      });
    }
    console.log("Gallery Images:", galleryImg);

    const { id } = req.user;
    const {
      name,
      email,
      phone,
      description,
      images,
      googleMap,
      address,
      slug,
      reviews,
    } = req.body;

    if (
      !name ||
      !email ||
      !phone ||
      !description ||
      !address ||
      !slug ||
      !reviews
    ) {
      return res.status(400).json({
        status: "error",
        message: "All fields are required",
      });
    }

    const existingSlug = await Business.findOne({ slug: slug });
    if (existingSlug) {
      return res.status(400).json({
        status: "error",
        message: "Slug already exists",
      });
    }

    const existingPhone = await Business.findOne({ phone: phone });
    if (existingPhone) {
      return res.status(400).json({
        status: "error",
        message: "Phone number already exists",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        status: "error",
        message: "Email is invalid",
      });
    }

    if (!validator.isMongoId(id)) {
      return res.status(400).json({
        status: "error",
        message: "User Id is invalid",
      });
    }
    images?.map((image) => {
      if (!validator.isURL(image)) {
        return res.status(400).json({
          status: "error",
          message: "Image url is invalid",
        });
      }
    });

    const user = await User.findById(id);
    console.log("user email", user.email);

    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "User not found",
      });
    }

    if (user.role !== "owner") {
      return res.status(400).json({
        status: "error",
        message: "You are not authorized to register business",
      });
    }

    const Ownerdata = await Owner.findOne({ ownerId: id }).lean();

    if (!Ownerdata) {
      return res.status(400).json({
        status: "error",
        message: "Ownerdata not found",
      });
    }

    const slugAlreadyExist = await Business.findOne({ slug: slug });
    if (slugAlreadyExist) {
      return res.status(400).json({
        status: "error",
        message: "Slug already exists",
      });
    }

    let businesstimings = [];
    try {
      businesstimings = JSON.parse(req.body.businessTiming);
    } catch (err) {
      return res.status(400).json({
        status: "error",
        message: "businesstimings must be a valid JSON array",
      });
    }

    let reviewsdata = [];
    try {
      reviewsdata = JSON.parse(req.body.reviews);
    } catch (err) {
      return res.status(400).json({
        status: "error",
        message: "Reviews must be a valid JSON array",
      });
    }

    reviewsdata = reviewsdata.map((review, index) => ({
      ...review,
      profileLogo: ProfileImg[index] || null,
    }));

    let socialLinksData = [];
    try {
      socialLinksData = JSON.parse(req.body.socialLinks);
    } catch (err) {
      return res.status(400).json({
        status: "error",
        message: "socialLinksData must be a valid JSON array",
      });
    }

    for (const review of reviewsdata) {
      if (!review.rating || !review.description || !review.name) {
        return res.status(400).json({
          status: "error",
          message: "Each review must have a Rating, Description, and  Name",
        });
      }
    }

    const myBusiness = await Business.create({
      name,
      email,
      phone,
      description,
      address,
      socialLinks: socialLinksData,
      slug: slug,
      profilelogo: ProfileImg,
      logo: logoImg,
      images,
      galleryImg,
      businessTiming: businesstimings,
      reviews: reviewsdata,
      googleMap,
      bookingService: Ownerdata.bookingService,
      fontService: Ownerdata.fontFamily,
      fontSize: Ownerdata.fontSize,
      websiteService: Ownerdata.websiteService,
      theme: Ownerdata.theme || "",
      createdBy: id,
      bannerText: Ownerdata.bannerText,
      color: Ownerdata.color,
      bannerImg: Ownerdata.bannerImge,
      rejectreason: Ownerdata.rejectreason,
    });

    const userMailSend = await sendEmail({
      email: user.email,
      subject: "New Business Created Successfully",
      html: `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Document</title>
      
          <style>
          
          @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500&display=swap');
          @media screen and (max-width: 800px) {
            .success-business{
              font-size: 12px !important;
                    }
                    .successfully-business{
                      font-size: 16px !important;
                    }
            .main-card{
             max-height:470px !important;
              padding:5px !important;
            }
            .sub-card{
              padding-right:5px !important;
              padding-left:10px !important;
            }
                }
          </style>
        </head>
        <body style="background-color: rgb(241, 236, 236);padding:30px">
          <div style="display: flex; justify-content: center; align-items: center" >
            <div class="main-card" style="background-color: black; max-width: 500px; height:550px;padding: 15px; margin:auto" >
              <div style="text-align: center;padding-top: 20px;"> <img src="${makelyLogo}" width="160px" height="auto" alt="MakelyPro">
              </div>
              <div style="text-align: center; padding-top: 20px;"> <img src="${circleTickImg}" width="66px" height="auto" alt="Check Icon">
              </div>
              <div style="text-align: center; color:#CAFF82; font-size: 22px; margin-top: 12px; margin-bottom : 15px;">
                  Congratulations
              </div>
      <div class="successfully-business" style="text-align: center; color: white; font-size: 22px; "> 
          Your Business Has Been<br/>
          Added Successfully
      </div>  
          <div style="color: white;font-size: 14px;padding-top:40px; padding-left: 35px;padding-right:35px;font-family: 'Poppins',sans-serif;font-weight: 400;">  
              <p style="padding: 12px 0px 12px 0px;">Dear ${user.name},</p>
              <p>
              Thank you for using ${myBusiness.name}. 
              We are heartfelt congratulations to you on successfully <br/>registering your business!
              </p> 
      </div>    
          </div>
      </div>
          </body>
           
        </body>
      </html>
      `,
    });

    if (!userMailSend) {
      console.error("Error sending confirmation emails");
      return res.status(500).json({
        status: "error",
        message: "Error sending confirmation emails",
      });
    }

    res.status(200).json({
      status: "success",
      data: await businessData({
        _id: myBusiness._id,
        name: myBusiness.name,
        email: myBusiness.email,
        phone: myBusiness.phone,
        description: myBusiness.description,
        address: myBusiness.address,
        socialLinks: myBusiness.socialLinks,
        businessTiming: myBusiness.businessTiming,
        profilelogo: myBusiness.ProfileImg,
        images: myBusiness.images,
        galleryImg,
        googleMap: myBusiness.googleMap,
        slug: myBusiness.slug,
        fontFamily: myBusiness.fontFamily,
        reviews: myBusiness.reviews,
        fontSize: myBusiness.fontSize,
        ...myBusiness,
        logo: logoImg,
        ...Ownerdata,
        theme: Ownerdata.theme,
        bannerText: Ownerdata.bannerText,
        bannerImg: Ownerdata.bannerImge,
        color: Ownerdata.color,
        rejectreason: Ownerdata.rejectreason,
      }),
      message: "Business registered successfully",
    });
  } catch (error) {
    console.log("Error in register business", error);
    res.status(400).json({ status: "error", message: error.message });
  }
};


const updateBusinessApi = async (req, res) => {
  console.log("req body 853", req.body);
  try {
    const { id, businessId } = req.body;

    if (!businessId) {
      return res.status(400).json({
        status: "error",
        message: "Owners business Id is required",
      });
    }

    if (!id) {
      return res.status(400).json({
        status: "error",
        message: "Business Id is required",
      });
    }

    const existingBusiness = await BusinesseditRequest.findById(id);
    if (!existingBusiness) {
      return res.status(404).json({
        status: "error",
        message: "Business not found",
      });
    }
    console.log("existingBusiness 867", existingBusiness);

    // Merge existingBusiness data into Business model
    const updatedBusinessFields = {
      name: existingBusiness.name,
      email: existingBusiness.email,
      phone: existingBusiness.phone,
      description: existingBusiness.description,
      address: existingBusiness.address,
      businessTiming: existingBusiness.businessTiming,
      socialLinks: existingBusiness.socialLinks,
      bookingService: existingBusiness.bookingService,
      websiteService: existingBusiness.websiteService,
      requestStatus: existingBusiness.requestStatus,
      reviews: existingBusiness.reviews,
      theme: existingBusiness.theme,
      googleMap: existingBusiness.googleMap,
      slug: existingBusiness.slug,
      galleryImg: existingBusiness.galleryImg,
      logo: existingBusiness.logo,
      bannerImg: existingBusiness.bannerImg,
      rejectreason: existingBusiness.rejectreason,
    };

    const updatedBusiness = await Business.findByIdAndUpdate(
      businessId,
      { $set: updatedBusinessFields },
      { new: true }
    );

    const updatedBusinessData = await businessData(updatedBusiness);

    console.log("updatedBusinessData", updatedBusinessData);
    res.status(200).json({
      status: "success",
      data: updatedBusinessData,
      message: "Business updated successfully",
    });
  } catch (error) {
    console.log("Error in updating business", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// const updateBusinessApi = async (req, res) => {
//   console.log("req body 853", req.body);
//   try {
//     const { id, businessId } = req.body;


//     if (!businessId) {
//       return res.status(400).json({
//         status: "error",
//         message: "Owners business Id is required",
//       });
//     }


//     if (!id) {
//       return res.status(400).json({
//         status: "error",
//         message: "business Id is required",
//       });
//     }

//     const existingBusiness = await BusinesseditRequest.findById(id);
//     if (!existingBusiness) {
//       return res.status(404).json({
//         status: "error",
//         message: "Business not found",
//       });
//     }
//     console.log("existingBusiness 867", existingBusiness)

//     // let logoImg = req.files?.["logo"]?.[0]?.path ?? existingBusiness?.logo;

//     // let ProfileImg = [];
//     // if (req.files["profileLogo"])
//     //   req.files["profileLogo"]?.forEach((file) => {
//     //     ProfileImg.push(file.path);
//     //   }) ?? existingBusiness?.profileLogo;

//     // let galleryImg = [];

//     // if (req.files && req.files["files"]) {
//     //   req.files["files"].forEach((file) => {
//     //     galleryImg.push(file.path);
//     //   });
//     // } else {
//     //   galleryImg = req.body?.files || [];
//     // }

//     // let socialLinksData = [];
//     // try {
//     //   socialLinksData = JSON.parse(socialLinks);
//     // } catch (err) {
//     //   return res.status(400).json({
//     //     status: "error",
//     //     message: "socialLinksData must be a valid JSON array",
//     //   });
//     // }

//     // let businesstimings;
//     // try {
//     //   businesstimings = JSON.parse(businessTiming);
//     // } catch (err) {
//     //   return res.status(400).json({
//     //     status: "error",
//     //     message: "businessTiming must be a valid JSON array",
//     //   });
//     // }

//     // let reviewsdata;
//     // try {
//     //   reviewsdata = JSON.parse(reviews);
//     // } catch (err) {
//     //   return res.status(400).json({
//     //     status: "error",
//     //     message: "Reviews must be a valid JSON array",
//     //   });
//     // }

//     // reviewsdata = reviewsdata.map((review, index) => ({
//     //   ...review,
//     //   profileLogo: imgFullPath(ProfileImg[index]) || null,
//     // }));

//     const updatedBusiness = await Business.findByIdAndUpdate(
//       { id: templateId },
//       {
   
//          $set:
//           { ...existingBusiness} ,

//       },
//       { new: true }
//     );



//     // await Template.findOneAndUpdate(
//     //   { _id: templateId },
//     //   {
//     //     $set: {
//     //       ...req.body,

//     //       bookingImage: bookingImg,
//     //       websiteImage: websiteImg,
//     //     },
//     //   },
//     //   { new: true }
//     // );


//     const updatedBusinessData = await businessData(updatedBusiness);

//     console.log("updatedBusinessData", updatedBusinessData);
//     res.status(200).json({
//       status: "success",
//       data: updatedBusinessData,
//       message: "Business updated successfully",
//     });
//   } catch (error) {
//     console.log("Error in updating business", error);
//     res.status(500).json({
//       status: "error",
//       message: error.message,
//     });
//   }
// };

const BusinessEditRequestApi = async (req, res) => {
  console.log("req body 853", req.body);

  try {
    const { id } = req.body;
    const businessId = req.body.id

    if (!id) {
      return res.status(400).json({
        status: "error",
        message: "business Id is required",
      });
    }

    const existingBusiness = await Business.findById(id);
    if (!existingBusiness) {
      return res.status(404).json({
        status: "error",
        message: "Business not found",
      });
    }

    console.log("existingBusiness in 1012 edit business", existingBusiness)

    let logoImg = req.files?.["logo"]?.[0]?.path ?? existingBusiness?.logo;

    let ProfileImg = [];
    if (req.files["profileLogo"])
      req.files["profileLogo"]?.forEach((file) => {
        ProfileImg.push(file.path);
      }) ?? existingBusiness?.profileLogo;

    let galleryImg = [];

    if (req.files && req.files["files"]) {
      req.files["files"].forEach((file) => {
        galleryImg.push(file.path);
      });
    } else {
      galleryImg = req.body?.files || [];
    }

    const {
      name,
      email,
      phone,
      description,
      images,
      googleMap,
      address,
      slug,
      reviews,
      businessTiming,
      socialLinks,
      status,
    } = req.body;

    if (
      !name ||
      !email ||
      !phone ||
      !description ||
      !address ||
      !slug ||
      !reviews
    ) {
      return res.status(400).json({
        status: "error",
        message: "All fields are required",
      });
    }


    let socialLinksData = [];
    try {
      socialLinksData = JSON.parse(socialLinks);
    } catch (err) {
      return res.status(400).json({
        status: "error",
        message: "socialLinksData must be a valid JSON array",
      });
    }

    let businesstimings;
    try {
      businesstimings = JSON.parse(businessTiming);
    } catch (err) {
      return res.status(400).json({
        status: "error",
        message: "businessTiming must be a valid JSON array",
      });
    }

    let reviewsdata;
    try {
      reviewsdata = JSON.parse(reviews);
    } catch (err) {
      return res.status(400).json({
        status: "error",
        message: "Reviews must be a valid JSON array",
      });
    }

    reviewsdata = reviewsdata.map((review, index) => ({
      ...review,
      profileLogo: imgFullPath(ProfileImg[index]) || null,
    }));

    const myBusiness = await BusinesseditRequest.create({
      businessId,
      name,
      email,
      phone,
      description,
      address,
      socialLinks: socialLinksData,
      slug: slug,
      profilelogo: ProfileImg,
      logo: logoImg,
      images,
      status,
      galleryImg,
      businessTiming: businesstimings,
      reviews: reviewsdata,
      googleMap,
    });
    const updatedBusinessData = await businessData(myBusiness);

    console.log("updatedBusinessData", updatedBusinessData);
    res.status(200).json({
      status: "success",
      data: updatedBusinessData,
      message: "Business request send successfully",
    });
  } catch (error) {
    console.log("Error in updating business", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// const BusinessGetRequestApi = async (req, res) => {
//   try {
//     const business = await BusinesseditRequest.find({
//     }).sort({ createdAt: -1 });

// // const business = await Business.find({ createdBy: owner.ownerId });

//     const businessDataList = [];

//     await Promise.all(
//       business.map(async (business) => {

//         businessDataList.push(await businessData(business));
//       })
//     );

//     console.log("businessDataList", businessDataList)
//     res.status(200).json({
//       status: "success",
//       data: businessDataList,
//     });
//   } catch (error) {
//     console.log("Error in getting all business", error);
//     res.status(400).json({ status: "error", message: error.message });
//   }

// }

const BusinessGetRequestApi = async (req, res) => {
  try {
    // Fetch the businesses and sort them by creation date in descending order
    const businesses = await BusinesseditRequest.find({}).sort({ createdAt: -1 }).populate('createdBy', 'name');
    console.log("businesses 1223",businesses)

    const businessDataList = [];

    await Promise.all(
      businesses.map(async (business) => {
        const businessofData = await businessData(business);
        businessofData.ownerName = business.createdBy.name;
        businessDataList.push(businessofData);
      })
    );

    console.log("businessDataList", businessDataList);

    res.status(200).json({
      status: "success",
      data: businessDataList,
    });
  } catch (error) {
    console.log("Error in getting all business", error);
    res.status(400).json({ status: "error", message: error.message });
  }
};


const GetEditBusinessRequestApi = async (req, res) => {
  console.log(req.body.id)
  try {
    const business = await BusinesseditRequest.findById(id)
    console.log("business 1223", business)

    const businessData = [];

    await Promise.all(
      business.map(async (business) => {
        businessData.push(await businessData(business));
      })
    );

    console.log("businessData", businessData)
    res.status(200).json({
      status: "success",
      data: businessData,
    });
  } catch (error) {
    console.log("Error in getting edit business", error);
    res.status(400).json({ status: "error", message: error.message });
  }

}

const getAllBusinessApi = async (req, res, next) => {
  try {
    const business = await Business.find({
      slug: { $ne: "dummy-business" },
    }).sort({ createdAt: -1 });

    const businessDataList = [];

    await Promise.all(
      business.map(async (business) => {
        businessDataList.push(await businessData(business));
      })
    );
    res.status(200).json({
      status: "success",
      data: businessDataList,
    });
  } catch (error) {
    console.log("Error in getting all business", error);
    res.status(400).json({ status: "error", message: error.message });
  }
};

const getBusinessByOwnerIdApi = async (req, res, next) => {

  try {
    if (req.user === undefined) {
      return res.status(400).json({ status: "error", message: "Invalid user" });
    }

    const { id } = req.user;
    const user = await User.findById(id);

    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "User not found",
      });
    }

    let business;

    if (user.role === "owner") {
      const owner = await Owner.findOne({ ownerId: id });
      if (!owner) {
        return res.status(400).json({
          status: "error",
          message: "Owner not found",
        });
      }

      business = await Business.find({ createdBy: owner.ownerId });

      if (!business || business.length === 0) {
        return res.status(400).json({
          status: "error",
          message: "Businesses not found for this owner",
        });
      }
    }

    res.status(200).json({
      status: "success",
      data: await MultiplebusinessData(business),
    });
  } catch (error) {
    console.log("Error in get business by user id", error);
    res.status(400).json({ status: "error", message: error.message });
  }
};

const MultiplebusinessData = async (businessData) => {
  if (!businessData || businessData.length === 0) {
    return [];
  }
  return businessData.map((business) => ({
    id: business._id,
    name: business.name,
    email: business.email,
    phone: business.phone,
    description: business.description,
    address: business.address,
    socialLinks: business.socialLinks,
    bookingService: business.bookingService,
    websiteService: business.websiteService,
    requestStatus: business.requestStatus,
    theme: business.theme || "",
    images: business.images,
    googleMap: business.googleMap,
    fontFamily: business.fontFamily,
    fontSize: business.fontSize,
    slug: business.slug,
    galleryImg: business.galleryImg.map(imgFullPath),
    logo: imgFullPath(business.logo),
    bannerText: business.bannerText,
    bannerImg: imgFullPath(business.bannerImg),
    color: business.color,
    amount: business.amount,
    rejectreason: business.rejectreason,
  }));
};

const getBusinessByUserIdApi = async (req, res) => {
  console.log("details of business 1090", req.body);
  try {
    if (req.user === undefined) {
      return res.status(400).json({ status: "error", message: "Invalid user" });
    }

    const { id } = req.user;
    const user = await User.findById(id);

    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "User not found",
      });
    }

    let business;
    if (user.role === "manager") {
      const manager = await Manager.findOne({ managerId: id });
      console.log("manger873", manager);
      if (!manager) {
        return res.status(400).json({
          status: "error",
          message: "Manager not found",
        });
      }

      business = await Business.findById(manager.businessId);

      const transactions = await Transaction.find({
        businessId: manager.businessId,
      });
      const transactionDates = [];

      for (const transaction of transactions) {
        const subscriptionEndDate = new Date(
          transaction.stripeSubscriptionEndDate * 1000
        );
        const sevenDaysBefore = new Date(
          subscriptionEndDate.getTime() - 7 * 24 * 60 * 60 * 1000
        );
        transactionDates.push(sevenDaysBefore);
      }

      if (!business) {
        return res.status(400).json({
          status: "error",
          message: "Business not found",
        });
      }
      business.TransactionDate = transactionDates;
    } else if (user.role === "admin") {
      const businessId = req.body.businessId;
      console.log("business ID FOR ADMIN EDIT", businessId);

      let businessById = await Business.findById(businessId);
      let businessBySlug = await Business.findOne({ slug: "dummy-business" });

      business = businessById || businessBySlug;

      console.log("final business", business);
    } else if (user.role === "owner") {
      const owner = await Owner.findOne({ ownerId: id });

      if (!owner) {
        return res.status(400).json({
          status: "error",
          message: "Owner not found",
        });
      }

      let businessId = req.body.businessId;

      if (!businessId) {
        return res.status(400).json({
          status: "error",
          message: "Business ID is required for owner role",
        });
      }

      businessId = businessId.replace(/^"(.*)"$/, "$1");
      business = await Business.findById(businessId);

      const transactions = await Transaction.find({ userId: owner.ownerId });

      const transactionDates = [];

      for (const transaction of transactions) {
        const subscriptionEndDate = new Date(
          transaction.stripeSubscriptionEndDate * 1000
        );
        const sevenDaysBefore = new Date(
          subscriptionEndDate.getTime() - 7 * 24 * 60 * 60 * 1000
        );
        transactionDates.push(sevenDaysBefore);
      }
      business.TransactionDate = transactionDates;
      if (!business) {
        return res.status(400).json({
          status: "error",
          message: "Business not found with the provided ID",
        });
      }
    }

    res.status(200).json({
      status: "success",
      data: await businessData(business),
    });
  } catch (error) {
    console.log("Error in get business by user id", error);
    res.status(400).json({ status: "error", message: error.message });
  }
};

const getBusinessDetailBySlugApi = async (req, res) => {
  try {
    const { slug } = req.params;
    if (!slug) {
      return res.status(400).json({
        status: "error",
        message: "Slug is required",
      });
    }
    const business = await Business.findOne({
      slug: slug,
    });
    console.log("business 9544", business);
    if (!business) {
      return res.status(400).json({
        status: "error",
        message: "Business not found",
      });
    }
    res.status(200).json({
      status: "success",
      data: await businessData(business),
    });
  } catch (error) {
    console.log("Error in get business by user id", error);
    res.status(400).json({ status: "error", message: error.message });
  }
};

const selectedTheme = async (req, res) => {
  try {
    if (req.user === undefined) {
      return res.status(400).json({ status: "error", message: "Invalid user" });
    }

    const { id } = req.user;
    const user = await User.findById(id);
    console.log("user 970", user);
    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "User not found",
      });
    }

    if (user.role !== "owner") {
      return res.status(400).json({
        status: "error",
        message: "You are not authorized to register business",
      });
    }

    const { theme, color, bannerText } = req.body;
    if (!theme) {
      return res.status(400).json({
        status: "error",
        message: "Theme is required",
      });
    }

    if (!color) {
      return res.status(400).json({
        status: "error",
        message: "color is required",
      });
    }
    if (!bannerText) {
      return res.status(400).json({
        status: "error",
        message: "banner text is required",
      });
    }

    const updateTheme = await Owner.updateOne(
      { ownerId: id },
      {
        $set: {
          theme: theme,
          color: color,
          bannerText: bannerText,
          bannerImge: req?.file?.path,
        },
      }
    );

    res.status(200).json({
      status: "success",
      updateTheme,
      message: "Theme updated successfully",
    });
  } catch (error) {
    console.log("Error in theme", error);
    res.status(400).json({ status: "error", message: error.message });
  }
};

const addDummyBusinessApi = async (req, res) => {
  // console.log("body request", req.body);
  // let logo = req.files["logo"][0].path;
  // let bannerImg = req.files["bannerImg"][0].path;

  // console.log("logo", logo);
  // console.log("bannerImg", bannerImg);

  // try {
  //   if (req.user === undefined) {
  //     return res.status(400).json({ status: "error", message: "Invalid user" });
  //   }

  //   const { id } = req.user;
  //   const {
  //     name,
  //     email,
  //     bannerText,
  //     color,
  //     phone,
  //     description,
  //     address,
  //     socialLinks,
  //     googleMap,
  //     fontFamily,
  //     fontSize,
  //     slug,
  //   } = req.body;

  //   const user = await User.findById(id);

  //   if (!user) {
  //     return res.status(400).json({
  //       status: "error",
  //       message: "User not found",
  //     });
  //   }

  //   if (user.role !== "admin") {
  //     return res.status(400).json({
  //       status: "error",
  //       message: "You are not authorized to add dummy business",
  //     });
  //   }

  //   const mySlug = slugify(slug, { lower: true, remove: /[*+~.()'"#!:@]/g });

  //   const slugAlreadyExist = await Business.findOne({ slug: mySlug });
  //   if (slugAlreadyExist) {
  //     return res.status(400).json({
  //       status: "error",
  //       message: "Slug already exists",
  //     });
  //   }

  //   const myBusiness = await Business.create({
  //     name,
  //     email,
  //     phone,
  //     description,
  //     address,
  //     logo,
  //     bannerImg,
  //     bannerText,
  //     color,
  //     socialLinks,
  //     googleMap,
  //     slug: mySlug,
  //     theme: "theme-1",
  //     bookingService: true,
  //     websiteService: true,
  //     fontFamily,
  //     fontSize,
  //   });

  //   console.log("Checking MY Buisness Payload ", myBusiness);
  //   res.status(200).json({
  //     status: "success",
  //     data: myBusiness,
  //     message: "Dummy Business Added Successfully",
  //   });
  // } catch (error) {
  //   console.log("Error in Dummy Business", error);
  //   res.status(400).json({ status: "error", message: error.message });
  // }

  console.log(
    "Logo File:",
    req?.files["logo"] ? req.files["logo"][0]?.path : "No logo file uploaded"
  );
  console.log("other Files:", req.files["files"]);
  console.log("req body 384", req.body.reviews);
  try {
    if (req.user === undefined) {
      return res.status(400).json({ status: "error", message: "Invalid user" });
    }
    //for logo Image
    const logoImg = req?.files["logo"] ? req.files["logo"][0]?.path : null;

    //for Profile Image
    let ProfileImg = [];
    if (req.files["profileLogo"]) {
      req.files["profileLogo"].forEach((file) => {
        ProfileImg.push(file.path);
      });
    }
    console.log("ProfileImg:", ProfileImg);

    //for gallery Images Array
    let galleryImg = [];
    if (req.files["files"]) {
      req.files["files"].forEach((file) => {
        galleryImg.push(file.path);
      });
    }
    console.log("Gallery Images:", galleryImg);

    const { id } = req.user;
    const {
      name,
      email,
      bannerText,
      phone,
      description,
      fontSize,
      color,
      bannerImg,
      images,
      googleMap,
      fontFamily,
      address,
      slug,
      reviews,
    } = req.body;

    if (
      !name ||
      !email ||
      !phone ||
      !description ||
      !address ||
      !slug ||
      !reviews
    ) {
      return res.status(400).json({
        status: "error",
        message: "All fields are required",
      });
    }

    const existingSlug = await Business.findOne({ slug: slug });
    if (existingSlug) {
      return res.status(400).json({
        status: "error",
        message: "Slug already exists",
      });
    }

    const existingPhone = await Business.findOne({ phone: phone });
    if (existingPhone) {
      return res.status(400).json({
        status: "error",
        message: "Phone number already exists",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        status: "error",
        message: "Email is invalid",
      });
    }

    if (!validator.isMongoId(id)) {
      return res.status(400).json({
        status: "error",
        message: "User Id is invalid",
      });
    }
    images?.map((image) => {
      if (!validator.isURL(image)) {
        return res.status(400).json({
          status: "error",
          message: "Image url is invalid",
        });
      }
    });

    const user = await User.findById(id);

    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "User not found",
      });
    }

    if (user.role !== "admin") {
      return res.status(400).json({
        status: "error",
        message: "You are not authorized to add dummy business",
      });
    }

    const slugAlreadyExist = await Business.findOne({ slug: slug });
    if (slugAlreadyExist) {
      return res.status(400).json({
        status: "error",
        message: "Slug already exists",
      });
    }

    let businesstimings = [];
    try {
      businesstimings = JSON.parse(req.body.businessTiming);
    } catch (err) {
      return res.status(400).json({
        status: "error",
        message: "businesstimings must be a valid JSON array",
      });
    }

    let reviewsdata = [];
    try {
      reviewsdata = JSON.parse(req.body.reviews);
    } catch (err) {
      return res.status(400).json({
        status: "error",
        message: "Reviews must be a valid JSON array",
      });
    }

    let socialLinksData = [];
    try {
      socialLinksData = JSON.parse(req.body.socialLinks);
    } catch (err) {
      return res.status(400).json({
        status: "error",
        message: "socialLinksData must be a valid JSON array",
      });
    }

    for (const review of reviewsdata) {
      if (!review.rating || !review.description || !review.name) {
        return res.status(400).json({
          status: "error",
          message: "Each review must have a Rating, Description, and  Name",
        });
      }
    }

    const myBusiness = await Business.create({
      name,
      email,
      phone,
      description,
      address,
      socialLinks: socialLinksData,
      slug: slug,
      profilelogo: ProfileImg,
      logo: logoImg,
      images,
      galleryImg,
      businessTiming: businesstimings,
      reviews: reviewsdata,
      googleMap,
      bookingService: true,
      websiteService: true,
      fontFamily,
      fontSize,
      theme: "theme-1",
      createdBy: id,
      bannerText,
      color: color,
      bannerImg,
    });
    console.log("myBusiness", myBusiness);
    res.status(200).json({
      status: "success",
      data: myBusiness,
      message: "Business registered successfully",
    });
  } catch (error) {
    console.log("Error in register business", error);
    res.status(400).json({ status: "error", message: error.message });
  }
};

const handleCustomBusinessApi = async (req, res) => {
  console.log("body request", req.body);
  try {
    if (req.user === undefined) {
      return res.status(400).json({ status: "error", message: "Invalid user" });
    }

    const { id } = req.user;
    const businessId = req.body.businessId;

    if (!businessId) {
      return res.status(400).json({
        status: "error",
        message: "Business ID is required",
      });
    }

    const { rejectreason } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "User not found",
      });
    }

    if (user.role !== "admin") {
      return res.status(400).json({
        status: "error",
        message: "You are not authorized to add business rejection",
      });
    }

    await Business.findByIdAndUpdate(
      businessId,
      {
        $set: {
          requestStatus: "Rejected",
          rejectreason: rejectreason,
        },
      },
      { new: true }
    );

    const myCustomBusinessData = await Business.findOne({ _id: businessId });

    const myCustomBusiness = await businessData(myCustomBusinessData);

    console.log("Checking My Buisness Payload ", myCustomBusiness);
    res.status(200).json({
      status: "success",
      data: myCustomBusiness,
      message: "Reason Send and Status Updated successfully",
    });
  } catch (error) {
    console.log("Error in Sending and Updating business", error);
    res.status(400).json({ status: "error", message: error.message });
  }
};

const handleCancelBusinessApi = async (req, res) => {
  console.log("body request", req.body);
  try {
    if (req.user === undefined) {
      return res.status(400).json({ status: "error", message: "Invalid user" });
    }

    const { id } = req.user;
    const businessId = req.body.businessId;

    if (!businessId) {
      return res.status(400).json({
        status: "error",
        message: "Business ID is required",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "User not found",
      });
    }

    if (user.role !== "admin") {
      return res.status(400).json({
        status: "error",
        message: "You are not authorized to add business rejection",
      });
    }

    await Business.findByIdAndUpdate(
      businessId,
      {
        $set: {
          requestStatus: "Approved",
        },
      },
      { new: true }
    );

    const myCustomBusinessData = await Business.findOne({ _id: businessId });

    const myCustomBusiness = await businessData(myCustomBusinessData);

    console.log("Checking My Buisness Payload ", myCustomBusiness);
    res.status(200).json({
      status: "success",
      data: myCustomBusiness,
      message: "Reason Send and Status Updated Successfully",
    });
  } catch (error) {
    console.log("Error in Sending and Updating Business", error);
    res.status(400).json({ status: "error", message: error.message });
  }
};

const customizeThemeApi = async (req, res) => {
  try {
    if (req.user === undefined) {
      return res.status(400).json({ status: "error", message: "Invalid user" });
    }

    const { id } = req.user;
    const businessId = req.body.businessId;

    if (!businessId) {
      return res.status(400).json({
        status: "error",
        message: "Businsess customize ID is required",
      });
    }

    const themeData = await Business.findById(businessId);

    let themeImg = req?.file?.path ?? themeData.bannerImg;
    console.log("updated Image", themeImg);

    const { color, bannerText, fontSize, fontFamily, theme } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "User not found",
      });
    }

    if (user.role !== "owner") {
      return res.status(400).json({
        status: "error",
        message: "You are not authorized to add business theme",
      });
    }

    await Business.findByIdAndUpdate(
      businessId,
      {
        $set: {
          color,
          bannerImg: themeImg,
          bannerText,
          fontSize,
          fontFamily,
          theme,
        },
      },
      { new: true }
    );

    const myCustomBusinessData = await Business.findOne({ _id: businessId });

    const myCustomBusiness = await businessData(myCustomBusinessData);
    res.status(200).json({
      status: "success",
      data: myCustomBusiness,
      message: "Theme Updated Successfully",
    });
  } catch (error) {
    console.log("Error in Updating Theme", error);
    res.status(400).json({ status: "error", message: error.message });
  }
};

const businessData = async (businessData) => {
  if (!businessData) {
    return null;
  }
  const newReviews = businessData?.reviews.map((review) => ({
    rating: review.rating,
    description: review.description,
    name: review.name,
    profileLogo: imgFullPath(review.profileLogo),
  }));
  return {
    id: businessData._id,
    name: businessData.name,
    status: businessData.status,
    email: businessData.email,
    phone: businessData.phone,
    description: businessData.description,
    address: businessData.address,
    businessTiming: businessData.businessTiming,
    socialLinks: businessData.socialLinks,
    bookingService: businessData.bookingService,
    websiteService: businessData.websiteService,
    requestStatus: businessData.requestStatus,
    profilelogo: businessData?.ProfileImg?.map(imgFullPath),
    timeSlots: businessData.timeSlots,
    reviews: newReviews,
    theme: businessData?.theme || "",
    images: businessData.images,
    googleMap: businessData.googleMap,
    fontFamily: businessData.fontFamily,
    fontSize: businessData.fontSize,
    slug: businessData.slug,
    galleryImg: businessData?.galleryImg?.map(imgFullPath),
    logo: imgFullPath(businessData.logo),
    bannerText: businessData.bannerText,
    bannerImg: imgFullPath(businessData.bannerImg),
    color: businessData.color,
    amount: businessData.amount,
    rejectreason: businessData.rejectreason,
    TransactionDate: businessData.TransactionDate,
  };
};

const getBusinessByServiceType = async (req, res) => {
  try {
    const { serviceTypeSlug, minPrice, maxPrice } = req.body;
    let myServiceTypeId = null;

    if (serviceTypeSlug) {
      const mySelectedServiceType = await ServiceType.findOne({
        slug: serviceTypeSlug,
      });

      if (!mySelectedServiceType) {
        return res.status(400).json({
          status: "error",
          message: "Service Type not found",
        });
      }
      myServiceTypeId = mySelectedServiceType._id;
    }

    let myBusinessIds = [];

    const services = await Service.find({
      typeId: myServiceTypeId ? myServiceTypeId : { $ne: null },
      price:
        minPrice && maxPrice ? { $gte: minPrice, $lte: maxPrice } : { $gte: 0 },
    });
    console.log("services", services);

    await Promise.all(
      services.map(async (service) => {
        const myServiceData = await getServiceData(service);
        myBusinessIds.push(myServiceData.businessId);
      })
    );

    const businesses = await Business.find({
      _id: { $in: myBusinessIds },
      slug: { $ne: "dummy-business" },
    });
    let myBusinessList = [];
    await Promise.all(
      businesses.map(async (business) => {
        const myBusinessData = await businessData(business);
        myBusinessList.push(myBusinessData);
      })
    );

    res.status(200).json({
      status: "success",
      data: myBusinessList,
    });
  } catch (error) {
    console.log("Error in get business by service type", error);
    res.status(400).json({ status: "error", data, message: error.message });
  }
};

const showAllBusinessApi = async (req, res) => { };

module.exports = {
  addSpecialistApi,
  updateSpecialsitApi,
  deleteSpecialistApi,
  handleCustomBusinessApi,
  getSpecialistByBusinessIdApi,
  addManagerApi,
  updateBusinessApi,
  BusinessEditRequestApi,
  deleteManagerApi,
  GetEditBusinessRequestApi,
  getBusinessByOwnerIdApi,
  BusinessGetRequestApi,
  getManagersByBusinessIdApi,
  getAllBusinessApi,
  registerBusinessApi,
  getBusinessByUserIdApi,
  getBusinessDetailBySlugApi,
  selectedTheme,
  addDummyBusinessApi,
  handleCancelBusinessApi,
  getBusinessByServiceType,
  businessData,
  customizeThemeApi,
  updateSpecialsitApi,
  showAllBusinessApi,
  updateManagerApi,
};

const getServiceData = async (service) => {
  const businessId = service.businessId;

  return {
    businessId,
    name: service.name,
    description: service.description,
    // image: imgFullPath(service.image),
    slug: service.slug,
    price: service.price,
    timeInterval: service.timeInterval,
    timeSlots: service.timeSlots,
  };
};

const getSpecialistData = async (data) => {
  const mySpecialistData = {
    name: data.name,
    email: data.email,
  };
  return mySpecialistData;
};
