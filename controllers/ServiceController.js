const Service = require("../models/ServiceModel");
const validator = require("validator");

const addServiceApi = async (req, res, next) => {
  try {
    console.log("Add Service Body", req.body);
    console.log("User", req.user);
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
  addServiceApi,
};
