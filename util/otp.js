const Otp = require("../models/OtpModel");

const createOTPFun = async (email) => {
  console.log("email4",email)
  try {
    const otp = Math.floor(100000 + Math.random() * 900000);
    await Otp.create({
      otp,
      email,
      createdAt: new Date(),
      expiredAt: new Date(+new Date() + 5 * 60 * 1000),
    });
    console.log("otp",otp)
    return otp;
  } catch (error) {
    console.log("Error in creating OTP", error);
    return false;
  }
};

module.exports = createOTPFun;
