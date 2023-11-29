const Employee = require("../models/EmployeeModel");
const validator = require("validator");
const User = require("../models/UserModel");

const addEmployeeApi = async (req, res, next) => {
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
        message: "You are not authorized to add employee",
      });
    }

    const isAlreadyEmployee = await Employee.findOne({ email });
    if (isAlreadyEmployee) {
      return res.status(400).json({
        status: "error",
        message: "Employee email already exists",
      });
    }

    await Employee.create({
      name,
      email,
      businessId,
    });

    res.status(200).json({
      status: "success",
      message: "Employee added successfully",
    });
  } catch (error) {
    console.log("Error in addEmployee", error);
    res.status(400).json({ status: "error", message: error.message });
  }
};

module.exports = {
  addEmployeeApi,
};
