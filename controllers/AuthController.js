const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const { createSecretToken } = require("../util/SecretToken");
require("dotenv").config();

const registerApi = async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    if (!email  || !password) {
      return res
        .status(400)
        .json({ status: "error", message: "All fields are required" });
    }

    const user = await User.create({
      email,
      password,
    });
    console.log("user102", user);

    const userData = await getUserData(user);
    res.status(201).json({
      status: "success",
      data: {
        user: userData,
      },
      message: "Account created successfully",
    });
  } catch (error) {
    console.log("Error in signup", error);
    res.status(400).json({ status: "error", message: error.message });
  }
};

const loginApi = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ status: "error", message: "All fields is required" });
    }

    const user = await User.findOne({ email });
    console.log("user224", user);

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
      const token = createSecretToken({ id: user._id });
      const userData = await getUserData(user);

      res.status(201).json({
        status: "success",
        data: {
          token,
          user: userData,
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

const checkTokenIsValidApi = async (req, res, next) => {
  const { id } = req.user;
  console.log("id", id);
  const user = await User.findById(id);
  if (!user) {
    return res.status(400).json({ status: "error", message: "Invalid user" });
  }

  const token = createSecretToken({ id: user._id });
  const userData = await getUserData(user);
  res.status(201).json({
    status: "success",
    data: {
      token,
      user: userData,
    },
    message: "Login successfull",
  });
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

module.exports = {
  registerApi,
  loginApi,
  checkTokenIsValidApi,
  logoutApi,
};

const getUserData = async (user) => {
  return {
    id: user._id,
    email: user.email,
    createdAt: user.createdAt,
    verified: user.verified,
    verifyAt: user.verifyAt,
  };
};