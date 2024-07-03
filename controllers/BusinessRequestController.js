const User = require("../models/UserModel");
const BusinessRequest = require("../models/BusinessRequest");
const requestAdminToRegister = async (req, res, next) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id);
    console.log("user", user);
    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "User not found",
      });
    }
    if (user.role !== "owner") {
      return res.status(400).json({
        status: "error",
        message: "You are not authorized to Request Business",
      });
    }
    const { description, googleBusiness, ownerId } = req.body;
    if (!description || !googleBusiness || !ownerId) {
      return res.status(400).json({
        status: "error",
        message: "All fields are required",
      });
    }
    const newBusiness = await BusinessRequest.create({
      ...req.body,
      ownerName: user.name,
      ownerId: user.id,
    });
    console.log("newBusiness", newBusiness);
    res.status(200).json({
      status: "success",
      data: newBusiness,
      message: "Request Send Successfully",
    });
  } catch (error) {
    console.error("Error in Sending Business Details ", error);
    res.status(500).json({ status: "error", message: error });
  }
};
const getAdminRequestToRegisterBusiness = async (req, res) => {
  try {
    const newBusinessData = [];
    const busienssData = await BusinessRequest.find({
      deletedAt: null || undefined,
      active: true,
    }).sort({ createdAt: -1 });
    if (!busienssData) {
      return res.status(400).json({
        status: "error",
        message: "Busienss Data not found",
      });
    }
    await Promise.all(
      busienssData.map(async (business) => {
        const ownerData = await User.findById(business.ownerId).select("name");
        const myBusinessData = await getBuinessData(business);
        newBusinessData.push({ ...myBusinessData, ownerName: ownerData.name });
      })
    );
    res.status(200).json({
      status: "success",
      data: newBusinessData,
    });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
};
module.exports = {
  requestAdminToRegister,
  getAdminRequestToRegisterBusiness,
};
const getBuinessData = async (business) => {
  const myServiceData = {
    description: business.description,
    googleBusiness: business.googleBusiness,
    ownerName: business.ownerName,
    ownerId: business.ownerId,
  };
  return myServiceData;
};
