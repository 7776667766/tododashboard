const User = require("../models/UserModel");
const Plan = require("../models/PlanModel");
const validator = require("validator");

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


const updatePlanApi = async (req, res) => {
  try {
   
    const { planId } = req.params;
    console.log("planId", planId);
    if (!planId) {
      return res.status(400).json({
        status: "error",
        message: "planId  is required",
      });
    }

    if (!validator.isMongoId(planId)) {
      return res.status(400).json({
        status: "error",
        message: "planId Id is invalid",
      });
    }

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
        message: "You are not authorized to update service type",
      });
    }

    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(400).json({
        status: "error",
        message: "Plan not found",
      });
    }
   
    const updatedPlan = await Plan.findOneAndUpdate(
      { _id: planId },
      { $set: { ...req.body} },
      { new: true }
    );

    const myPlan = await getPlanData(updatedPlan);

    res.status(200).json({
      status: "success",
      data: myPlan,
      message: "Service Type updated successfully",
    });
  } catch (error) {
    console.error("Error in updating service", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

const deletePlanApi = async (req, res, next) => {
  try {
    const { planId } = req.params;
  console.log("planId",planId)
    if (!planId || !validator.isMongoId(planId)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid plan ID",
      });
    }

    const plan = await Plan.findById(planId);

    if (!plan) {
      return res.status(400).json({
        status: "error",
        message: "plan not found",
      });
    }
    await Plan.findByIdAndUpdate(
      { _id: planId },
      { deletedAt: new Date() }
    );

    res.status(200).json({
      status: "success",
      message: "Plan deleted successfully",
    });
  } catch (error) {
    console.log("Error in deleting plan", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
module.exports = {
  addPlanApi,
  getBusinessPlanListApi,
  deletePlanApi,
  updatePlanApi
};

const getPlanData = async (data) => {
   const myPlan = {
    id: data._id,
    name: data.name,
    duration: data.duration,
    price: data.price,
    isFeatured: data.isFeatured
  };
  return myPlan;
};

