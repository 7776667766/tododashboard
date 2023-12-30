const User = require("../models/UserModel");
const Plan = require("../models/PlanModel");

const addPlanApi = async (req, res, next) => {
  try {
    const { id } = req.user;

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
        message: "You are not authorized to add plan",
      });
    }

    const { name, duration, price, features } = req.body;

    if (!name || !duration || !price || !features) {
      return res.status(400).json({
        status: "error",
        message: "All fields are required",
      });
    }

    const newPlan = await Plan.create({
      ...req.body,
      userId: id,
    });

    res.status(201).json({
      status: "success",
      data: newPlan,
      message: "New plan added successfully",
    });
  } catch (error) {
    console.error("Error in adding Plan Details", error);
    res.status(500).json({ status: "error", message: error });
  }
};

const getBusinessPlanListApi = async (req, res, next) => {
  try {
    const planData = await Plan.find({});
    if (!planData) {
      return res.status(400).json({
        status: "error",
        message: "Plan not found",
      });
    }
    res.status(200).json({
      status: "success",
      data: planData,
    });
  } catch (error) {
    console.log("Error in get planData by user id", error);
    res.status(400).json({ status: "error", message: error.message });
  }
};

module.exports = {
  addPlanApi,
  getBusinessPlanListApi,
};
