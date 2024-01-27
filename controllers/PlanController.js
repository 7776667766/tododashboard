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
        message: "You are not authorized to add Packages",
      });
    }

    const { name, duration, price, features  } = req.body;

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
      message: "New Package Added Successfully",
    });
  } catch (error) {
    console.error("Error in Adding Package Details", error);
    res.status(500).json({ status: "error", message: error });
  }
};

const getBusinessPlanListApi = async (req, res, next) => {
  try {
    const planData = await Plan.find({ deletedAt: { $exists: false } })
        if (!planData) {
      return res.status(400).json({
        status: "error",
        message: "Package not found",
      });
    }
    res.status(200).json({
      status: "success",
      data: planData,
    });
  } catch (error) {
    console.log("Error in get Package by user id", error);
    res.status(400).json({ status: "error", message: error.message });
  }
};
 
const updatePlanApi = async (req, res) => {
  try {
    const {packageId}=req.params
    console.log("packageID",packageId)

    
    const plan = await Plan.findById(packageId);
    if (!plan) {
      return res.status(400).json({
        status: "error",
        message: "Package not found",
      });
    }

     await Plan.findOneAndUpdate(
      { _id: packageId },
      { $set: { ...req.body } },
      { new: true }
    );
    const myPlanData = await Plan.findOne({ _id: packageId });
    const myPlan = await getPlanData(myPlanData);

    res.status(200).json({
      status: "success",
      data: myPlan,
      message: "Package Updated Successfully",
    });
  } catch (error) {
    console.error("Error in Updating Package", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

const deletePlanApi = async (req, res, next) => {
  try {
    const { planId } = req.params;

    if (!planId || !validator.isMongoId(planId)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid Package ID",
      });
    }

    const plan = await Plan.findById(planId);

    if (!plan) {
      return res.status(400).json({
        status: "error",
        message: "Package not found",
      });
    }

    await Plan.findByIdAndUpdate(
      { _id: planId },
      { deletedAt: new Date() }
    );

    res.status(200).json({
      status: "success",
      message: "Package deleted successfully",
      data: plan,
    });
  } catch (error) {
    console.log("Error in deleting Package", error);
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
  const myPlanData = {
    id: data._id,
    name: data.name,
    duration: data.duration,
    price: data.price,
    isFeatured: data.isFeatured
  };
  return myPlanData;
};

