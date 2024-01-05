const validator = require("validator");
const User = require("../models/UserModel");
const Manager = require("../models/ManagerModel");
const Specialist = require("../models/SpecialistModel");
const Business = require("../models/BusinessModal");
const slugify = require("slugify");
const { sendEmail } = require("../util/sendEmail");
const imgFullPath = require("../util/imgFullPath");
const Owner = require("../models/OwnerModel");

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
    const specialists = await Specialist.find({ businessId }).select({
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
    console.log("Error in get specialist", error);
    res.status(400).json({ status: "error", message: error.message });
  }
};

const addManagerApi = async (req, res, next) => {
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

const updateManagerApi = async (req, res, next) => {
  try {
    if (req.user === undefined) {
      return res.status(400).json({ status: "error", message: "Invalid user" });
    }
    const { id } = req.user;
    const { managerId } = req.params;
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
        message: "You are not authorized to update this manager",
      });
    }
    const managerData = await User.findById(managerId);
    if (!managerData) {
      return res.status(400).json({
        status: "error",
        message: "Manager not found",
      });
    }
    const updatedManagerData = await User.findByIdAndUpdate(
      managerId,
      req.body
    );
    res.status(200).json({
      status: "success",
      data: {
        id: updatedManagerData._id,
        name: updatedManagerData.name,
        email: updatedManagerData.email,
        phone: updatedManagerData.phone,
        ...req.body,
      },
      message: "Manager updated successfully",
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
      address,
      socialLinks,
      images,
      googleId,
      slug,
    } = req.body;

    if (
      !name ||
      !email ||
      !phone ||
      !description ||
      !address ||
      !socialLinks ||
      !images ||
      !googleId ||
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
    images.map((image) => {
      if (!validator.isURL(image)) {
        return res.status(400).json({
          status: "error",
          message: "Image url is invalid",
        });
      }
    });
    socialLinks.map((link) => {
      if (!validator.isURL(link.link)) {
        return res.status(400).json({
          status: "error",
          message: "Social link is invalid",
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
      socialLinks,
      slug: mySlug,
      logo: req.file.path,
      images,
      googleId,
      bookingService: Ownerdata.bookingService,
      websiteService: Ownerdata.websiteService,
      theme: Ownerdata.theme || "",
      createdBy: id,
    });

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
        id: myBusiness._id,
        name: myBusiness.name,
        email: myBusiness.email,
        phone: myBusiness.phone,
        description: myBusiness.description,
        address: myBusiness.address,
        socialLinks: myBusiness.socialLinks,
        images: myBusiness.images,
        googleId: myBusiness.googleId,
        slug: myBusiness.slug,
        ...myBusiness,
        logo: req.file.path,
        ...Ownerdata,
        theme: Ownerdata.theme,
      }),
      message: "Business registered successfully",
    });
  } catch (error) {
    console.log("Error in register business", error);
    res.status(400).json({ status: "error", data, message: error.message });
  }
};

const getBusinessByUserIdApi = async (req, res, next) => {
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

    if (user.role === "manager") {
      const manager = await Manager.findOne({ managerId: id });
      if (!manager) {
        return res.status(400).json({
          status: "error",
          message: "Manager not found",
        });
      }
      const business = await Business.findById(manager.businessId);
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
    } else {
      const business = await Business.findOne({ createdBy: id });
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
    }
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

    const { theme } = req.body;
    if (!theme) {
      return res.status(400).json({
        status: "error",
        message: "Theme is required",
      });
    }
    // const updateTheme = await Owner.updateOne(
    //     { ownerId: id },
    //     { $set: { theme: theme } }
    //   );

    const updateTheme = await Owner.updateOne(
      { ownerId: id },
      { theme: theme }
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

module.exports = {
  addSpecialistApi,
  getSpecialistByBusinessIdApi,
  addManagerApi,
  updateManagerApi,
  deleteManagerApi,
  getManagersByBusinessIdApi,
  registerBusinessApi,
  getBusinessByUserIdApi,
  getBusinessDetailBySlugApi,
  selectedTheme,
};

const businessData = async (businessData) => {
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
    theme: businessData?.theme || "",
    images: businessData.images,
    googleId: businessData.googleId,
    slug: businessData.slug,
    logo: imgFullPath(businessData.logo),
  };
};
