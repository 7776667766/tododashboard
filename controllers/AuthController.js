const User = require("../models/UserModel");
const Otp = require("../models/OtpModel");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { createSecretToken } = require("../util/SecretToken");

const registerApi = async (req, res, next) => {
  try {
    const { name, email, phone, password, confirmPassword, image, role } =
      req.body;
    if (!email || !name || !phone || !image || !password || !confirmPassword) {
      return res
        .status(400)
        .json({ status: "error", message: "All fields are required" });
    }
    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid email" });
    }
    if (!validator.isMobilePhone(phone, "any", { strictMode: true })) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid phone number" });
    }
    if (!validator.isURL(image)) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid image url" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ status: "error", message: "Password must be 8 characters" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({
        status: "error",
        message: "Password and confirm password not match",
      });
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

    await User.create({ email, name, phone, image, role, password });
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
    console.log("Login Api body", req.body);
    const { phone, password } = req.body;
    if (!phone || !password) {
      return res
        .status(400)
        .json({ status: "error", message: "All fields is required" });
    }
    const user = await User.findOne({
      $or: [{ email: phone }, { phone: phone }],
    });

    if (!user) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid phone number" });
    }

    if (user && (await bcrypt.compare(password, user.password))) {
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
    } else {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid credientials" });
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

    const otpDoc = await Otp.findOne({ otp, phone });
    if (!otpDoc) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid phone or otp" });
    }
    console.log("otpDoc", otpDoc);
    if (otpDoc.otp !== otp) {
      return res
        .status(400)
        .json({ status: "error", message: "Otp not match" });
    }

    if (new Date() > otpDoc.expiredAt) {
      return res.status(400).json({ status: "error", message: "OTP expired" });
    }
    let user = await User.findOne({ phone });
    if (!user) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid phone or otp" });
    }
    if (user.verified === false) {
      await User.updateOne({ phone }, { verified: true, verifyAt: new Date() });
      user.verified = true;
      user.verifyAt = new Date();
    }
    const token = createSecretToken({ id: user._id });
    res.status(200).json({
      status: "success",
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          image: user.image,
          role: user.role,
          createdAt: user.createdAt,
          verified: user.verified,
          verifyAt: user.verifyAt,
        },
      },
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.log("Error in verify otp", error);
    res.status(400).json({ status: "error", message: error.message });
  }
};

const forgetPasswordApi = async (req, res, next) => {
  try {
    console.log("Forget Password Api body", req.body);
    const { phone } = req.body;
    if (!phone) {
      return res
        .status(400)
        .json({ status: "error", message: "Phone is required" });
    }
    if (!validator.isMobilePhone(phone, "any", { strictMode: true })) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid phone number" });
    }
    const user = await User.findOne({ phone });
    if (!user) {
      return res
        .status(400)
        .json({ status: "error", message: "Phone not exist" });
    } else {
      const otp = Math.floor(100000 + Math.random() * 900000);
      await Otp.create({ otp, phone: user.phone });
      res.status(201).json({
        status: "success",
        message: "OTP sent successfully",
      });
    }
  } catch (error) {
    console.log("Error in forget password", error);
    res.status(400).json({ status: "error", message: error.message });
  }
};

const resetPasswordApi = async (req, res, next) => {
  try {
    console.log("Reset Password Api body", req.body);
    const { password, confirmPassword, otp, phone } = req.body;
  } catch (error) {
    console.log("Error in reset password", error);
    res.status(400).json({ status: "error", message: error.message });
  }
};

const changePasswordApi = async (req, res, next) => {
  try {
    const { id } = req.user;
    if (!validator.isMongoId(id)) {
      return res.status(400).json({ status: "error", message: "Invalid id" });
    }
    const { oldPassword, newPassword, confirmPassword } = req.body;
    if (!oldPassword || !newPassword || !confirmPassword) {
      return res
        .status(400)
        .json({ status: "error", message: "All fields are required" });
    }
    if (newPassword.length < 8) {
      return res
        .status(400)
        .json({ status: "error", message: "Password must be 8 characters" });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        status: "error",
        message: "Password and confirm password not match",
      });
    }
    if (oldPassword === newPassword) {
      return res.status(400).json({
        status: "error",
        message: "Old password and new password should not be same",
      });
    }
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(400)
        .json({ status: "error", message: "User not found" });
    }
    if (!(await bcrypt.compare(oldPassword, user.password))) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid old password" });
    }
    await User.updateOne(
      { _id: id },
      { password: bcrypt.hashSync(newPassword, 10) }
    );
    res.status(200).json({
      status: "success",
      message: "Password changed successfully",
    });
  } catch (error) {
    console.log("Error in change password", error);
    res.status(400).json({ status: "error", message: error.message });
  }
};

const userProfileApi = async (req, res, next) => {
  try {
    const { id } = req.user;
    console.log("User id", id);
    if (!validator.isMongoId(id)) {
      return res.status(400).json({ status: "error", message: "Invalid id" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res
        .status(400)
        .json({ status: "error", message: "User not found" });
    }
    res.status(200).json({
      status: "success",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          image: user.image,
          role: user.role,
          createdAt: user.createdAt,
          verified: user.verified,
          verifyAt: user.verifyAt,
        },
      },
      message: "User profile fetched successfully",
    });
  } catch (error) {
    console.log("Error in user profile", error);
    res.status(400).json({ status: "error", message: error.message });
  }
};

module.exports = {
  registerApi,
  loginApi,
  verifyOtpApi,
  forgetPasswordApi,
  changePasswordApi,
  userProfileApi,
};
