const User = require("../models/UserModel");
const Otp = require("../models/OtpModel");
const validator = require("validator");
const { createSecretToken } = require("../util/SecretToken");

const registerApi = async (req, res, next) => {
  try {
    const { email, name, phone, image, role } = req.body;
    if (!email || !name || !phone || !image) {
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

    await User.create({ email, name, phone, image, role });
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
    const { phone } = req.body;
    if (!phone) {
      return res
        .status(400)
        .json({ status: "error", message: "Email or phone is required" });
    }
    const user = await User.findOne({
      $or: [{ email: phone }, { phone: phone }],
    });

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

    const otpDoc = await Otp.findOne({ phone })
      .sort({ createdAt: -1 })
      .limit(1);

    if (!otpDoc) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid phone or otp" });
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
      return res
        .status(400)
        .json({ status: "error", message: "Invalid phone or otp" });
    }
    if (user.verified === false) {
      await User.updateOne({ phone }, { verified: true, verifyAt: new Date() });
      // user = await User.findOne({ phone });
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

const userProfileApi = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ status: "error", message: "Id is required" });
    }
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

module.exports = { registerApi, loginApi, verifyOtpApi, userProfileApi };
