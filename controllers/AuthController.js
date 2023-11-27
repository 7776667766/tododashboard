const User = require("../models/UserModel");
const { createSecretToken } = require("../util/SecretToken");

module.exports.Signup = async (req, res, next) => {
  try {
    console.log("req.body", req.body);
    const { email, name, phone, image, role } = req.body;
    if (!email || !name || !phone || !image) {
      return res
        .status(400)
        .json({ status: "error", message: "All fields are required" });
    }
    if (phone.length !== 10) {
      return res
        .status(400)
        .json({ status: "error", message: "Phone number must be 10 digits" });
    }
    if (isNaN(phone)) {
      return res
        .status(400)
        .json({ status: "error", message: "Phone number must be a number" });
    }
    const isEmailExist = await User.findOne({ email });
    if (isEmailExist) {
      return res
        .status(400)
        .json({ status: "error", message: "Email already in use" });
    }
    const isPhoneExist = await User.findOne({ phone });
    if (isPhoneExist) {
      return res
        .status(400)
        .json({ status: "error", message: "Phone number already in use" });
    }

    const user = await User.create({ email, name, phone, image, role });
    const token = createSecretToken({ id: user._id });
    res
      .status(201)
      .json({ data: { token, user }, message: "Signup successfull" });
  } catch (error) {
    console.log("Error in signup", error);
    res.status(400).json({ status: "error", message: error.message });
  }
};
