const User = require("../models/UserModel");
const Owner = require("../models/OwnerModel");
const Business = require("../models/BusinessModal");
const Otp = require("../models/OtpModel");
const validator = require("validator");
const bcrypt = require("bcrypt");
const { createSecretToken } = require("../util/SecretToken");
const { sendEmail } = require("../util/sendEmail");
require("dotenv").config();

const registerApi = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      confirmPassword,
      image,
      role,
      websiteService,
      bookingService,
    } = req.body;
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
    if (!validator.isURL(image, { require_protocol: true })) {
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

    if (role === "owner") {
      if (!websiteService && !bookingService) {
        return res.status(400).json({
          status: "error",
          message: "Website service or booking service are required",
        });
      }
    }

    const user = await User.create({
      email,
      name,
      phone,
      image,
      role,
      password,
    });
    const otp = Math.floor(100000 + Math.random() * 900000);
    await Otp.create({ otp, phone });

    const mailSend = await sendEmail({
      email: user.email,
      subject: "OTP for signup",
      text: `Your OTP for signup is ${otp}`,
      html: `<p>
      Your Makely Pro OTP ( One Time Passcode ) For Signup is : <b>${otp}</b>.
      <br />
OTP Is Valid For 05 Mins
<br />
Please Don't Share Your OTP With Anyone For Your Account Security
<br />
Thank You
      </p>`,
    });

    if (!mailSend) {
      return res.status(400).json({
        status: "error",
        message: "Error in sending email",
      });
    }

    res.status(201).json({
      status: "success",
      message: "Account created successfully",
    });
  } catch (error) {
    console.log("Error in signup", error);
    res.status(400).json({ status: "error", message: error.message });
  }
};

const loginApi = async (req, res, next) => {
  try {
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
        .json({ status: "error", message: "Invalid credientials" });
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      if (user.deletedAt !== undefined) {
        if (user.deletedAt !== null) {
          return res
            .status(400)
            .json({ status: "error", message: "Account has been deleted" });
        }
      }
      const otp = Math.floor(100000 + Math.random() * 900000);
      await Otp.create({ otp, phone: user.phone });
      const mailSend = await sendEmail({
        email: user.email,
        subject: "OTP for login",
        text: `Your OTP for login is ${otp}`,
        html: `<p>
        Your Makely Pro OTP ( One Time Passcode ) For Login is : <b>${otp}</b>.
        <br />
OTP Is Valid For 05 Mins
<br />
Please Don't Share Your OTP With Anyone For Your Account Security
<br />
Thank You
        </p>`,
      });
      // res.status(201).json({
      //   status: "success",
      //   message: "OTP sent successfully",
      // });
      if (!mailSend) {
        return res.status(400).json({
          status: "error",
          message: "Error in sending email",
        });
      }
      // res.status(201).json({
      //   status: "success",
      //   message: "OTP sent successfully",
      // });
      const token = createSecretToken({ id: user._id });
      res.status(201).json({
        status: "success",
        data: {
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            image: process.env.SERVER_URL + user.image,
            role: user.role,
            createdAt: user.createdAt,
            verified: user.verified,
            verifyAt: user.verifyAt,
          },
        },
        message: "Login successfull",
      });
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
    const { phone, otp } = req.body;
    if (!phone || !otp) {
      return res
        .status(400)
        .json({ status: "error", message: "Phone and otp are required" });
    }

    const otpDoc = await Otp.findOne({
      phone,
      otp,
    }).sort({ $natural: 1 });
    if (!otpDoc) {
      return res.status(400).json({ status: "error", message: "Invalid otp" });
    }
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
      return res.status(400).json({ status: "error", message: "Invalid otp" });
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
          image: process.env.SERVER_URL + user.image,
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
      const mailSend = await sendEmail({
        email: user.email,
        subject: "OTP for forget password",
        text: `Your OTP for forget password is ${otp}`,
        html: `<p>
        Your Makely Pro OTP ( One Time Passcode ) For Forget Password is : <b>${otp}</b>.
        <br />
OTP Is Valid For 05 Mins
<br />
Please Don't Share Your OTP With Anyone For Your Account Security
<br />
Thank You
        </p>`,
      });
      if (!mailSend) {
        return res.status(400).json({
          status: "error",
          message: "Error in sending email",
        });
      }
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
    const { password, confirmPassword, phone } = req.body;
    if (!phone || !password || !confirmPassword) {
      return res
        .status(400)
        .json({ status: "error", message: "All fields are required" });
    }
    if (!validator.isMobilePhone(phone, "any", { strictMode: true })) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid phone number" });
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
    await User.updateOne(
      { phone },
      { password: bcrypt.hashSync(password, 10) }
    );
    res.status(200).json({
      status: "success",
      message: "Password reset successfully",
    });
  } catch (error) {
    console.log("Error in reset password", error);
    res.status(400).json({ status: "error", message: error.message });
  }
};

const changePasswordApi = async (req, res, next) => {
  try {
    if (req.user === undefined) {
      return res.status(400).json({ status: "error", message: "Invalid user" });
    }
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

const logoutApi = async (req, res, next) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ status: "success", message: "Logout successfully" });
  } catch (error) {
    console.log("Error in logout", error);
    res.status(400).json({ status: "error", message: error.message });
  }
};

const getUserProfileApi = async (req, res, next) => {
  try {
    if (req.user === undefined) {
      return res.status(400).json({ status: "error", message: "Invalid user" });
    }
    const { id } = req.user;
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
          image: process.env.SERVER_URL + user.image,
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

const updataUserProfileApi = async (req, res, next) => {
  console.log(req);
  try {
    if (!req.file) {
      return res.status(400).send("No image file uploaded");
    }

    if (req.user === undefined) {
      return res.status(400).json({ status: "error", message: "Invalid user" });
    }
    const { id } = req.user;
    if (!validator.isMongoId(id)) {
      return res.status(400).json({ status: "error", message: "Invalid id" });
    }
    const { name, image } = req.body;

    await User.updateOne({ _id: id }, { name, image });
    const user = await User.findById(id);
    res.status(200).json({
      status: "success",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          image: process.env.SERVER_URL + req.file.path,
          role: user.role,
          createdAt: user.createdAt,
          verified: user.verified,
          verifyAt: user.verifyAt,
        },
      },
      message: "User profile updated successfully",
    });
  } catch (error) {
    console.log("Error in update user profile", error);
    res.status(400).json({ status: "error", message: error.message });
  }
};

const getAllUsersApi = async (req, res, next) => {
  try {
    if (req.user === undefined) {
      return res.status(400).json({ status: "error", message: "Invalid user" });
    }
    const { id } = req.user;
    if (!validator.isMongoId(id)) {
      return res.status(400).json({ status: "error", message: "Invalid id" });
    }
    const myUser = await User.findById(id);
    if (!myUser) {
      return res
        .status(400)
        .json({ status: "error", message: "User not found" });
    }
    if (myUser.role !== "admin") {
      return res.status(400).json({
        status: "error",
        message: "You are not authorized to access users",
      });
    }
    const users = await User.find({
      _id: { $ne: id },
      deletedAt: null || undefined,
    }).select({
      _id: 0,
      id: "$_id",
      name: 1,
      email: 1,
      phone: 1,
      image: 1,
      role: 1,
      createdAt: 1,
      verified: 1,
      verifyAt: 1,
    });

    res.status(200).json({
      status: "success",
      data: {
        users,
      },
      message: "Users fetched successfully",
    });
  } catch (error) {
    console.log("Error in get all users", error);
    res.status(400).json({ status: "error", message: error.message });
  }
};

module.exports = {
  registerApi,
  loginApi,
  verifyOtpApi,
  forgetPasswordApi,
  resetPasswordApi,
  changePasswordApi,
  logoutApi,
  getUserProfileApi,
  updataUserProfileApi,
  getAllUsersApi,
};
