const User = require("../models/UserModel");
const Otp = require("../models/OtpModel");
const { createSecretToken } = require("../util/SecretToken");

const registerApi = async (req, res, next) => {
  try {
    console.log("Register Api Body", req.body);
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
    // generate otp
    const otp = Math.floor(100000 + Math.random() * 900000);
    // save otp in db
    await Otp.create({ otp, phone });
    // send otp to user
    res.status(201).json({
      status: "success",
      message: "User created successfully",
    });
    // const token = createSecretToken({ id: user._id });
    // res.status(201).json({
    //   data: {
    //     token,
    //     user: {
    //       id: user._id,
    //       name: user.name,
    //       email: user.email,
    //       phone: user.phone,
    //       image: user.image,
    //       role: user.role,
    //       verified: user.verified,
    //       createdAt: user.createdAt,
    //       verifyAt: user.verifyAt,
    //     },
    //   },
    //   message: "Signup successfull",
    // });
  } catch (error) {
    console.log("Error in signup", error);
    res.status(400).json({ status: "error", message: error.message });
  }
};

const loginApi = async (req, res, next) => {
  try {
    log("Login Api body", req.body);
    const { email, phone } = req.body;
    if (!email && !phone) {
      return res
        .status(400)
        .json({ status: "error", message: "Email or phone is required" });
    }
    const user = await User.findOne({ $or: [{ email }, { phone }] });

    if (!user) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid email or phone" });
    } else {
      const otp = Math.floor(100000 + Math.random() * 900000);
      await Otp.create({ otp, phone: user.phone });
      res.status(201).json({
        status: "success",
        message: "OTP sent successfully",
      });
      // const token = createSecretToken({ id: user._id });
      // res.status(201).json({
      //   data: {
      //     token,
      //     user: {
      //       id: user._id,
      //       name: user.name,
      //       email: user.email,
      //       phone: user.phone,
      //       image: user.image,
      //       role: user.role,
      //       createdAt: user.createdAt,
      //       verified: user.verified,
      //       verifyAt: user.verifyAt,
      //     },
      //   },
      //   message: "Login successfull",
      // });
    }
  } catch (error) {
    console.log("Error in login", error);
    res.status(400).json({ status: "error", message: error.message });
  }
};

const verifyOtpApi = async (req, res, next) => {
  try {
    console.log("Verify Otp Api body", req.body);
    const { phone, otp } = req.body;
    if (!phone || !otp) {
      return res
        .status(400)
        .json({ status: "error", message: "Phone and otp are required" });
    }
    const otpDoc = await Otp.findOne({ phone });
    console.log("otpDoc", otpDoc);
    if (!otpDoc) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid phone or otp" });
    }
    if (otpDoc.otp !== otp) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid phone or otp" });
    }
    const user = await User.findOne({ phone });
    if (!user) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid phone or otp" });
    }
    await User.updateOne({ phone }, { verified: true, verifyAt: new Date() });
    res.status(200).json({
      status: "success",
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.log("Error in verify otp", error);
    res.status(400).json({ status: "error", message: error.message });
  }
};

module.exports = { registerApi, loginApi, verifyOtpApi };
