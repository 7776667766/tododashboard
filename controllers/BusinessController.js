const validator = require("validator");
const User = require("../models/UserModel");
const Manager = require("../models/ManagerModel");
const Specialist = require("../models/SpecialistModel");
const Business = require("../models/BusinessModal");
const slugify = require("slugify");
const { sendEmail } = require("../util/sendEmail");
const imgFullPath = require("../util/imgFullPath");
const Owner = require("../models/OwnerModel");
const Service = require("../models/Service/ServiceModel");
const ServiceType = require("../models/Service/ServiceTypeModel");
const Transaction = require("../models/TransactionModel");

const addSpecialistApi = async (req, res, next) => {
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
      message: "Specialist added successfully",
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
    const specialists = await Specialist.find({ deletedAt: { $exists: false }, businessId }).select({
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

// const getBusinessBybusinessIdApi = async (req, res, next) => {
//   try {
//     const { businessId } = req.params;
//     if (!businessId) {
//       return res.status(400).json({
//         status: "error",
//         message: "Business Id is required",
//       });
//     }
//     if (!validator.isMongoId(businessId)) {
//       return res.status(400).json({
//         status: "error",
//         message: "Business Id is invalid",
//       });
//     }
//     console.log("businessId", businessId)

//     const business = await Business.findById(businessId)
//     console.log("business", business)
//     // const businessDataList = [];

//     // await Promise.all(
//     //   business.map(async (business) => {
//     //     businessDataList.push(await businessData(business));
//     //   })
//     // );
//     // console.log("businessDataList",businessDataList)

//     res.status(200).json({
//       status: "success",
//       data: business,
//     });
//   } catch (error) {
//     console.log("Error in getting all business", error);
//     res.status(400).json({ status: "error", message: error.message });
//   }
// }


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
        message: "Specilaist Not Found",
      });
    }
    await Specialist.findByIdAndUpdate(
      { _id: specilaistId },
      { deletedAt: new Date() }
    );

    res.status(200).json({
      status: "success",
      message: "Specilaist Deleted Successfully",
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
    console.log("req.body", req.body);
    console.log("req.params", req.params);

    const { specialistId } = req.params;

    console.log("specialistId", specialistId);

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

const deleteManagerApi = async (req, res, next) => {
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
        message: "You are not authorized to delete this manager",
      });
    }

    await User.findByIdAndUpdate(manager.managerId, { deletedAt: new Date() });
    await Manager.findOneAndUpdate({ managerId }, { deletedAt: new Date() });
    res.status(200).json({
      status: "success",
      message: "Manager deleted successfully",
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

const registerBusinessApi = async (req, res, next) => {
  try {
    if (req.user === undefined) {
      return res.status(400).json({ status: "error", message: "Invalid user" });
    }

    const { id } = req.user;
    const {
      name,
      email,
      phone,
      description,
      images,
      socialLinks,
      googleId,
      // fontFamily,
      // fontSize,
      // rejectreason,
      address,
      slug,
    } = req.body;

    if (
      !name ||
      !email ||
      !phone ||
      !description ||
      !address ||
      !slug
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
    if (!validator.isMongoId(id)) {
      return res.status(400).json({
        status: "error",
        message: "User Id is invalid",
      });
    }
    if (!validator.isMobilePhone(phone, "any", { strictMode: true })) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid phone number" });
    }
    images?.map((image) => {
      if (!validator.isURL(image)) {
        return res.status(400).json({
          status: "error",
          message: "Image url is invalid",
        });
      }
    });
    socialLinks?.map((link) => {
      if (!validator.isURL(link.link)) {
        return res.status(400).json({
          status: "error",
          message: "Social link is invalid",
        });
      }
    });

    const user = await User.findById(id);
    console.log("user email", user.email)

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

    const myBusiness = await Business.create({
      name,
      email,
      phone,
      description,
      address,
      socialLinks,
      slug: slug,
      logo: req?.file?.path,
      images,
      googleId,
      bookingService: Ownerdata.bookingService,
      fontService: Ownerdata.fontFamily,
      fontSize: Ownerdata.fontSize,
      websiteService: Ownerdata.websiteService,
      theme: Ownerdata.theme || "",
      createdBy: id,
      bannerText: Ownerdata.bannerText,
      color: Ownerdata.color,
      bannerImg: Ownerdata.bannerImge,
      rejectreason: Ownerdata.rejectreason
    });

    console.log(myBusiness, "myBusinessData111111");
    console.log("user email5511", user.email)

    const userMailSend = await sendEmail({
      email: user.email,
      subject: "New Business Created Successfully",
      html: `<p>Dear ${user.name},<br /><br />We are pleased to inform you that 
      a new business has been successfully created. 
      Thank you for choosing ${myBusiness.name}.<br /><br />
      For your reference, here are some important details:<br />
      - Business Website: www.business/${slug} <br />
      - Date of Creation: ${myBusiness.createdAt}<br /><br />
      If you have any questions or require further assistance,
       feel free to contact us.<br /><br />Best Regards,<br />www.makely.com</p>`,
    });
    console.log("user mail send", userMailSend)

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
        images: myBusiness.images,
        googleId: myBusiness.googleId,
        slug: myBusiness.slug,
        fontFamily: myBusiness.fontFamily,
        fontSize: myBusiness.fontSize,
        ...myBusiness,
        logo: req?.file?.path,
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

const getAllBusinessApi = async (req, res, next) => {
  try {
    const business = await Business.find({
      slug: { $ne: "dummy-business" },
    });

    const businessDataList = [];

    await Promise.all(
      business.map(async (business) => {
        businessDataList.push(await businessData(business));
      })
    );
    console.log("businessDataList", businessDataList)
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
    console.log("businessbyowneridusers", id)

    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "User not found",
      });
    }

    let business;

    if (user.role === "owner") {
      const owner = await Owner.findOne({ ownerId: id });
      console.log("ownerId ", owner)
      if (!owner) {
        return res.status(400).json({
          status: "error",
          message: "Owner not found",
        });
      }

      business = await Business.find({ createdBy: owner.ownerId });
      console.log("business", business)

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
  return businessData.map(business => ({
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
    googleId: business.googleId,
    fontFamily: business.fontFamily,
    fontSize: business.fontSize,
    slug: business.slug,
    logo: imgFullPath(business.logo),
    bannerText: business.bannerText,
    bannerImg: imgFullPath(business.bannerImg),
    color: business.color,
    amount: business.amount,
    rejectreason: business.rejectreason,
  }));
};


// const getBusinessByUserIdApi = async (req, res, next) => {
//   try {
//     if (req.user === undefined) {
//       return res.status(400).json({ status: "error", message: "Invalid user" });
//     }
  
//     const { id } = req.user;
//     const user = await User.findById(id);

//     if (!user) {
//       return res.status(400).json({
//         status: "error",
//         message: "User not found",
//       });
//     }
//     const { businessId } = req.body;
//     // console.log("businessId728",businessId)

//     let business;
  
//     if (user.role === "manager") {
//       const manager = await Manager.findOne({ managerId: id });
//       if (!manager) {
//         return res.status(400).json({
//           status: "error",
//           message: "Manager not found",
//         });
//       }
//       console.log("manager", manager)

//       business = await Business.findById(manager.businessId);

//       if (!business) {
//         return res.status(400).json({
//           status: "error",
//           message: "Business not found",
//         });
//       }
//     } else if (user.role === "admin") {
//       const targetSlug = "dummy-business";
//       business = await Business.findOne({ slug: targetSlug });

//       if (!business) {
//         return res.status(400).json({
//           status: "error",
//           message: "dummy business not found",
//         });
//       }
//       console.log("businessId760", business._id);
//     } else if (user.role === "owner") {

//       const owner = await Owner.findOne({ ownerId: id });
//       if (!owner) {
//         return res.status(400).json({
//           status: "error",
//           message: "Owner not found",
//         });
//       }
    
//       business = await Business.findById(businessId);

//       console.log("business774",business)

//       // business = await Business.findOne({
//       //   createdBy: id,
//       // });
//       console.log("business773",business)

//       if (!business) {
//         return res.status(400).json({
//           status: "error",
//           message: "Business not found",
//         });
//       }
//     }
    
//     res.status(200).json({
//       status: "success",
//       data: await businessData(business),
//     });
//   } catch (error) {
//     console.log("Error in get business by user id", error);
//     res.status(400).json({ status: "error", message: error.message });
//   }
// };
const getBusinessByUserIdApi = async (req, res, next) => {
  console.log("789",req.body)
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
      if (!manager) {
        return res.status(400).json({
          status: "error",
          message: "Manager not found",
        });
      }
      
      business = await Business.findById(manager.businessId);

      if (!business) {
        return res.status(400).json({
          status: "error",
          message: "Business not found",
        });
      }
    } else if (user.role === "admin") {
      const targetSlug = "dummy-business";
      business = await Business.findOne({ slug: targetSlug });

      if (!business) {
        return res.status(400).json({
          status: "error",
          message: "Dummy business not found",
        });
      }
    } else if (user.role === "owner") {
      const owner = await Owner.findOne({ ownerId: id });
      if (!owner) {
        return res.status(400).json({
          status: "error",
          message: "Owner not found",
        });
      }
    
      let businessId = req.body.businessId; 

      console.log("businessId852", businessId);
      
      if (!businessId) {
          return res.status(400).json({
              status: "error",
              message: "Business ID is required for owner role",
          });
      }
      
      businessId = businessId.replace(/^"(.*)"$/, '$1'); 
      business = await Business.findById(businessId);
      console.log("business862",business)

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


const getBusinessDetailBySlugApi = async (req, res, next) => {
  try {
    const { slug } = req.params;
    console.log("slug", slug);
    if (!slug) {
      return res.status(400).json({
        status: "error",
        message: "Slug is required",
      });
    }
    const business = await Business.findOne({
      slug: slug,
    });
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

const selectedTheme = async (req, res, next) => {
  console.log("req.body", req.body);
  try {
    if (req.user === undefined) {
      return res.status(400).json({ status: "error", message: "Invalid user" });
    }

    const { id } = req.user;
    const user = await User.findById(id);
    console.log(id, "ownerId");

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
          bannerImge: req.file.path,
        },
      }
    );

    console.log("updated theme", updateTheme);

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
  console.log("body request", req.body);
  let logo = req.files["logo"][0].path;
  let bannerImg = req.files["bannerImg"][0].path;

  console.log("logo", logo);
  console.log("bannerImg", bannerImg);

  try {
    if (req.user === undefined) {
      return res.status(400).json({ status: "error", message: "Invalid user" });
    }

    const { id } = req.user;
    const {
      name,
      email,
      bannerText,
      color,
      phone,
      description,
      address,
      socialLinks,
      googleId,
      fontFamily,
      fontSize,
      slug,
    } = req.body;

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

    const mySlug = slugify(slug, { lower: true, remove: /[*+~.()'"#!:@]/g });

    const slugAlreadyExist = await Business.findOne({ slug: mySlug });
    if (slugAlreadyExist) {
      return res.status(400).json({
        status: "error",
        message: "Slug already exists",
      });
    }

    const myBusiness = await Business.create({
      name,
      email,
      phone,
      description,
      address,
      logo,
      bannerImg,
      bannerText,
      color,
      socialLinks,
      googleId,
      slug: mySlug,
      theme: "theme-1",
      bookingService: true,
      websiteService: true,
      fontFamily,
      fontSize,
    });

    console.log("Checking MY Buisness Payload ", myBusiness);
    res.status(200).json({
      status: "success",
      data: myBusiness,
      message: "Dummy Business Added Successfully",
    });
  } catch (error) {
    console.log("Error in Dummy Business", error);
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

    const {
      rejectreason
    } = req.body;

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


    console.log("Checking MYBuisness Payload ", myCustomBusiness);
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


    console.log("Checking MYBuisness Payload ", myCustomBusiness);
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

const customizeThemeApi = async (req, res, next) => {
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

    const themeData = await Business.findById(businessId);

    let themeImg = req?.file?.path ?? themeData.bannerImg;
    console.log("updated Image", themeImg)

    const {
      color,
      bannerText,
      fontSize,
      fontFamily,
      theme
    } = req.body;

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
          theme

        },
      },
      { new: true }
    );

    const myCustomBusinessData = await Business.findOne({ _id: businessId });

    const myCustomBusiness = await businessData(myCustomBusinessData);
    res.status(200).json({
      status: "success",
      data: myCustomBusiness,
      message: "Theme Updated successfully",
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
  return {
    id: businessData._id,
    name: businessData.name,
    email: businessData.email,
    phone: businessData.phone,
    description: businessData.description,
    address: businessData.address,
    socialLinks: businessData.socialLinks,
    bookingService: businessData.bookingService,
    websiteService: businessData.websiteService,
    requestStatus: businessData.requestStatus,
    theme: businessData?.theme || "",
    images: businessData.images,
    googleId: businessData.googleId,
    fontFamily: businessData.fontFamily,
    fontSize: businessData.fontSize,
    slug: businessData.slug,
    logo: imgFullPath(businessData.logo),
    bannerText: businessData.bannerText,
    bannerImg: imgFullPath(businessData.bannerImg),
    color: businessData.color,
    amount: businessData.amount,
    rejectreason: businessData.rejectreason,
  };
};

const getBusinessByServiceType = async (req, res, next) => {
  console.log("1305",req.body)
  try {
    const { serviceTypeSlug, minPrice, maxPrice } = req.body;
    let myServiceTypeId = null;
    // if (!serviceTypeSlug) {
    //   return res.status(400).json({
    //     status: "error",
    //     message: "Service Type Slug is required",
    //   });
    // }
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
    // const services = await Service.find({ typeId: mySelectedServiceType._id, price });

    const services = await Service.find({
      typeId: myServiceTypeId ? myServiceTypeId : { $ne: null },
      price:
        minPrice && maxPrice ? { $gte: minPrice, $lte: maxPrice } : { $gte: 0 },
    });
    console.log("services", services);
    // const myBusinessIds = services.map((service) => service.businessId);

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
    console.log("myBusinessList",myBusinessList)
    
  } catch (error) {
    console.log("Error in get business by service type", error);
    res.status(400).json({ status: "error", data, message: error.message });
  }
};

const showAllBusinessApi = async (req, res, next) => { };

module.exports = {
  addSpecialistApi,
  updateSpecialsitApi,
  deleteSpecialistApi,
  handleCustomBusinessApi,
  getSpecialistByBusinessIdApi,
  addManagerApi,
  // updateManagerApi,
  deleteManagerApi,
  // getBusinessBybusinessIdApi,
  getBusinessByOwnerIdApi,
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
