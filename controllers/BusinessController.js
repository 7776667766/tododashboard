const Specialist = require("../models/SpecialistModel");
const validator = require("validator");
const User = require("../models/UserModel");
const Manager = require("../models/ManagerModel");

const addSpecialistApi = async (req, res, next) => {
  try {
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

    await Specialist.create({
      name,
      email,
      businessId,
    });

    res.status(200).json({
      status: "success",
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

    await Manager.create({
      businessId,
      createdBy: id,
      managerId: newUser._id,
    });

    res.status(200).json({
      status: "success",
      message: "Manager added successfully",
    });
  } catch (error) {
    console.log("Error in add manager", error);
    res.status(400).json({ status: "error", message: error.message });
  }
};

const updateManagerApi = async (req, res, next) => {
  try {
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
    await User.findByIdAndUpdate(managerId, req.body);
    res.status(200).json({
      status: "success",
      message: "Manager updated successfully",
    });
  } catch (error) {
    console.log("Error in update manager", error);
    res.status(400).json({ status: "error", message: error.message });
  }
};

const deleteManagerApi = async (req, res, next) => {
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
    const managers = await Manager.find({ businessId });
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

module.exports = {
  addSpecialistApi,
  getSpecialistByBusinessIdApi,
  addManagerApi,
  updateManagerApi,
  deleteManagerApi,
  getManagersByBusinessIdApi,
};
