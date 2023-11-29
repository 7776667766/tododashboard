const Service = require("../models/Service/ServiceModel");
const User = require("../models/UserModel");
const ServiceType = require("../models/Service/ServiceTypeModel");
const validator = require("validator");

const addServiceTypeApi = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({
        status: "error",
        message: "Name is required",
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
        message: "You are not authorized to add service type",
      });
    }

    const isServiceTypeExist = await ServiceType.findOne({ name });
    if (isServiceTypeExist) {
      return res.status(400).json({
        status: "error",
        message: "Service type already exists",
      });
    }

    await ServiceType.create({
      name,
      createdBy: id,
    });

    res.status(200).json({
      status: "success",
      message: "Service type added successfully",
    });
  } catch (error) {
    console.log("Error in add service type", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const addServiceApi = async (req, res, next) => {
  try {
    const {
      name,
      description,
      image,
      price,
      type,
      specialist,
      date,
      businessId,
      timeSlots,
    } = req.body;
    if (
      !name ||
      !description ||
      !image ||
      !price ||
      !type ||
      !specialist ||
      !date ||
      !businessId ||
      !timeSlots
    ) {
      return res.status(400).json({
        status: "error",
        message: "All fields are required",
      });
    }

    if (!validator.isURL(image)) {
      return res.status(400).json({
        status: "error",
        message: "Image URL is invalid",
      });
    }

    if (!validator.isMongoId(type)) {
      return res.status(400).json({
        status: "error",
        message: "Type is invalid",
      });
    }

    if (!validator.isMongoId(specialist)) {
      return res.status(400).json({
        status: "error",
        message: "Specialist is invalid",
      });
    }

    if (!validator.isMongoId(businessId)) {
      return res.status(400).json({
        status: "error",
        message: "Business is invalid",
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "User not found",
      });
    }

    if (user.role !== "shopkeeper") {
      return res.status(400).json({
        status: "error",
        message: "You are not authorized to add service",
      });
    }

    const isServiceTypeExist = await ServiceType.findById(type);
    if (!isServiceTypeExist) {
      return res.status(400).json({
        status: "error",
        message: "Service type does not exists",
      });
    }

    const isSpecialistExist = await Employee.findById(specialist);
    if (!isSpecialistExist) {
      return res.status(400).json({
        status: "error",
        message: "Specialist does not exists",
      });
    }

    const isBusinessExist = await Business.findById(businessId);
    if (!isBusinessExist) {
      return res.status(400).json({
        status: "error",
        message: "Business does not exists",
      });
    }

    await Service.create({
      name,
      description,
      image,
      price,
      type,
      specialist,
      date,
      businessId,
      timeSlots,
      shopkeeperId: req.user.id,
    });

    res.status(200).json({
      status: "success",
      message: "Service added successfully",
    });
  } catch (error) {
    console.log("Error in creating service", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

module.exports = {
  addServiceTypeApi,
  addServiceApi,
};
