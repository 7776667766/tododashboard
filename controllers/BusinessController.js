const Specialist = require("../models/SpecialistModel");
const validator = require("validator");
const User = require("../models/UserModel");

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

module.exports = {
  addSpecialistApi,
};
