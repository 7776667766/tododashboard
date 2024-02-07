const User = require("../models/UserModel");
const Owner = require("../models/OwnerModel");
const Business = require("../models/BusinessModal");
const Otp = require("../models/OtpModel");
const validator = require("validator");
const bcrypt = require("bcrypt");
const { createSecretToken } = require("../util/SecretToken");
const { sendEmail } = require("../util/sendEmail");
const createOTPFun = require("../util/otp");
const imgFullPath = require("../util/imgFullPath");
const { sendSMS } = require("../util/twilo");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const registerApi = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      confirmPassword,
      role,
      bookingService,
      websiteService,
    } = req.body;

    if (!email || !name || !phone || !password || !confirmPassword) {
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

    if (password.length < 8) {
      return res
        .status(400)
        .json({ status: "error", message: "Password must be 8 characters" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        status: "error",
        message: "Password and confirm password do not match",
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

    if (role === "owner" && !websiteService && !bookingService) {
      return res.status(400).json({
        status: "error",
        message: "Website service or booking service is required",
      });
    }

    const user = await User.create({
      email,
      name,
      phone,
      image: req.file.path,
      role,
      password,
    });

    if (role === "owner") {
      const OwnerData = await Owner.create({
        ownerId: user._id,
        websiteService: websiteService,
        bookingService: bookingService,
        theme: "",
      });
      console.log("FATA OWNER", OwnerData);
    }

    const otp = await createOTPFun(user.phone);
    const mailSend = await sendEmail({
      email: user.email,
      subject: "OTP for signup",
      text: `Your OTP for signup is ${otp}`,
      html: `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Document</title>
      
          <style>
  
  @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500&display=swap');
  
  /* Default styles outside of media query */


  /* Media query for screen width up to 768px */
  @media screen and (max-width: 800px) {
    .para-makely1{
      font-size: 0.625rem !important;
      line-height: 19px !important;
      
    }
    .para-makely{
      font-size: 0.625rem !important;
      
      
    }
    .hole-container{
      padding-left: 0px !important;
      padding-right: 8px !important;
    }
    body{
      
      padding-top:10px !important;
      padding-bottom:10px !important;
      padding-right:20px !important;
      padding-left:20px !important;
    }
    .card-wdth{
      max-width: 400px !important;
  
    }
  }
</style>
        </head>
        <body style="background-color: #E3E3E3;padding-top:30px;padding-bottom:30px;padding-right:15px;padding-left:15px;">
         
            <div class="card-wdth" style="background-color: white !important; max-width: 550px; height: auto;padding: 15px; margin:auto;" >
              <div style="text-align: center;margin-top: 10px; padding-top: 20px;"> <img src="https://makely.bixosoft.com/_next/static/media/makely.b4c87dfe.png"  width="160px" height="auto" alt="Description of the image">
              </div>
          <div><p style="text-align: center;font-weight: 500;font-size: 26px;font-family: 'Poppins', sans-serif;font-size: 18px;color: #000000;">Let’s Sign You Up  </p></div>
          <div class="hole-container" style="padding-left: 35px;padding-right:35px;font-family: 'Poppins',sans-serif;font-weight: 400;"> 
          <div style="color: #303030;font-size: 14px;font-family: 'Poppins', sans-serif;padding-top:13px;"><p>Dear User,</p></div>
      
      <div><p class="para-makely" style="color: #303030;font-size: 14px;font-family: 'Poppins', sans-serif;padding-top:13px;">Thank you for choosing MAKELY PRO. Use This One Time Passcode (OTP) to complete your Sign Up Procedure & Verify Your Accont on MAKELY PRO.</p></div>
      <div style="height: 70px;background-color: rgb(206, 246, 232);border: none;outline: none;width: 100%;letter-spacing: 10px;font-size: 40px;font-weight: 600;display:flex;justify-content:center;align-items: center;padding:5px;margin-top:15px">
      <span style="font-size:30px;margin:auto">${otp}</span>
        <!-- <input type="tel" id="otp" name="otp" maxlength="6" style="border: none;outline: none;text-align: center;height: 70px;background-color: rgb(206, 246, 232);width: 100%;letter-spacing: 10px;font-size: 40px;font-weight: 600;" > -->
      </div>
      <div class="para-makely" style="padding-top: 13px; color: #303030;font-size: 14px;font-family: 'Poppins', sans-serif"><p>This OTP is Valid For 05 Mins</p></div>
      <div ><p class="para-makely" style="color: #FF5151;font-size: 14px;font-family: 'Poppins', sans-serif;">“Please Don't Share Your OTP With Anyone For Your Account <br> Security.”</p></div>
      
      <p class="para-makely" style="color: #303030 ;font-size: 14px;font-weight: 600;font-size: 18px;font-family: 'Poppins', sans-serif;padding-top:12px">Thank You</p>
      </div>
            
          </div>
    
          </body>
           
        
      </html>
      `,
    });

    if (!mailSend) {
      return res.status(400).json({
        status: "error",
        message: "Error in sending email",
      });
    }

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

// const getImageBase64 = (imagePath) => {
//   return new Promise((resolve, reject) => {
//     fs.readFile(imagePath, (err, data) => {
//       if (err) {
//         reject(err);
//       } else {
//         const base64Image = Buffer.from(data).toString('base64');
//         resolve(base64Image);
//       }
//     });
//   });
// };
const imagePath = path.join(__dirname ,'uplaods/images/checkedlogin_1.png');
console.log(imagePath)
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

      const otp = await createOTPFun(user.phone);

      const mailSend = await sendEmail({
        email: user.email,
        subject: "OTP for login",
        text: `Your OTP for login is ${otp}`,
        html: `<!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Document</title>
        
            <style>
    
    @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500&display=swap');
    
    /* Default styles outside of media query */
 

    /* Media query for screen width up to 768px */
    @media screen and (max-width: 800px) {
      .para-makely1{
        font-size: 0.625rem !important;
        line-height: 19px !important;
        
      }
      .para-makely{
        font-size: 0.625rem !important;
        
        
      }
      .hole-container{
        padding-left: 0px !important;
        padding-right: 8px !important;
      }
      body{
        background-color: white !important;
        padding-top:10px !important;
        padding-bottom:10px !important;
        padding-right:20px !important;
        padding-left:20px !important;
      }
      .card-wdth{
        max-width: 400px !important;
    
      }
    }
  </style>
          </head>
          <body style="background-color: #E3E3E3;padding-top:30px;padding-bottom:30px;padding-right:15px;padding-left:15px;">
           
              <div class="card-wdth" style="background-color: white !important; max-width: 550px; height: auto;padding: 15px; margin:auto;" >
                <div style="text-align: center;margin-top: 10px; padding-top: 20px;"> <img src="https://makely.bixosoft.com/_next/static/media/makely.b4c87dfe.png"  width="160px" height="auto" alt="Description of the image">
                </div>
            <div><p style="text-align: center;font-weight: 500;font-size: 26px;font-family: 'Poppins', sans-serif;font-size: 18px;color: #000000;">Let’s Sign You In  </p></div>
            <div class="hole-container" style="padding-left: 35px;padding-right:35px;font-family: 'Poppins',sans-serif;font-weight: 400;"> 
            <div style="color: #303030;font-size: 14px;font-family: 'Poppins', sans-serif;padding-top:13px;"><p>Dear User,</p></div>
        
        <div><p class="para-makely" style="color: #303030;font-size: 14px;font-family: 'Poppins', sans-serif;padding-top:13px;">Thank you for choosing MAKELY PRO. Use This One Time Passcode (OTP) to complete your Sign Up Procedure & Verify Your Accont on MAKELY PRO.</p></div>
        <div style="height: 70px;background-color: rgb(206, 246, 232);border: none;outline: none;width: 100%;letter-spacing: 10px;font-size: 40px;font-weight: 600;display:flex;justify-content:center;align-items: center;padding:5px;margin-top:15px">
        <span style="font-size:30px;margin:auto">${otp}</span>
          <!-- <input type="tel" id="otp" name="otp" maxlength="6" style="border: none;outline: none;text-align: center;height: 70px;background-color: rgb(206, 246, 232);width: 100%;letter-spacing: 10px;font-size: 40px;font-weight: 600;" > -->
        </div>
        <div class="para-makely" style="padding-top: 13px; color: #303030;font-size: 14px;font-family: 'Poppins', sans-serif"><p>This OTP is Valid For 05 Mins</p></div>
        <div ><p class="para-makely" style="color: #FF5151;font-size: 14px;font-family: 'Poppins', sans-serif;">“Please Don't Share Your OTP With Anyone For Your Account <br> Security.”</p></div>
        
        <p class="para-makely" style="color: #303030 ;font-size: 14px;font-weight: 600;font-size: 18px;font-family: 'Poppins', sans-serif;padding-top:12px">Thank You</p>
        </div>
              
            </div>
      
            </body>
             
          
        </html>
        `,

        headers: {
          "Content-Type": "multipart/mixed",
          "Content-Disposition": "inline",
        },
      });

      if (!mailSend) {
        return res.status(400).json({
          status: "error",
          message: "Error in sending email",
        });
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

const verifyOtpApi = async (req, res, next) => {
  try {
    const { phone, otp, type } = req.body;
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

    if (type === "reset") {
      return res
        .status(200)
        .json({ status: "success", message: "OTP verified successfully" });
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
    const userData = await getUserData(user);

    res.status(200).json({
      status: "success",
      data: {
        token,
        user: userData,
      },
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.log("Error in verify otp", error);
    res.status(400).json({ status: "error", message: error.message });
  }
};

// const forgetPasswordApi = async (req, res, next) => {
//   try {
//     const { phone } = req.body;
//     if (!phone) {
//       return res
//         .status(400)
//         .json({ status: "error", message: "Phone is required" });
//     }
//     if (!validator.isMobilePhone(phone, "any", { strictMode: true })) {
//       return res
//         .status(400)
//         .json({ status: "error", message: "Invalid phone number" });
//     }
//     const user = await User.findOne({ phone });
//     if (!user) {
//       return res
//         .status(400)
//         .json({ status: "error", message: "Phone not exist" });
//     } else {

//       const otp = await createOTPFun(user.phone);

//       try {
//         await sendSMS(user.phone, `Your OTP for forget password is ${otp}`);
//         console.log(user.phone)
//         console.log('SMS sent successfully');
//       } catch (smsError) {
//         console.error('Error sending SMS:', smsError.message);

//         return res.status(400).json({
//           status: "error",
//           message: "Error in sending SMS",
//         });
//       }

//       const mailSend = await sendEmail({
//         email: user.email,
//         subject: "OTP for forget password",
//         text: `Your OTP for forget password is ${otp}`,
//         html: `<p>
//         Your Makely Pro OTP ( One Time Passcode ) For Forget Password is : <b>${otp}</b>.
//         <br />
// OTP Is Valid For 05 Mins
// <br />
// Please Don't Share Your OTP With Anyone For Your Account Security
// <br />
// Thank You
//         </p>`,
//       });
//       if (!mailSend) {
//         return res.status(400).json({
//           status: "error",
//           message: "Error in sending email",
//         });
//       }
//       res.status(201).json({
//         status: "success",
//         message: "OTP sent successfully",
//       });
//     }
//   } catch (error) {
//     console.log("Error in forget password", error);
//     res.status(400).json({ status: "error", message: error.message });
//   }
// };

const forgetPasswordApi = async (req, res, next) => {
  try {
    const { phone, email } = req.body;

    if (!phone && !email) {
      return res
        .status(400)
        .json({ status: "error", message: "Phone or email is required" });
    }

    let user;

    if (phone) {
      if (!validator.isMobilePhone(phone, "any", { strictMode: true })) {
        return res
          .status(400)
          .json({ status: "error", message: "Invalid phone number" });
      }
      user = await User.findOne({ phone });
    } else {
      user = await User.findOne({ email });
    }

    if (!user) {
      return res
        .status(400)
        .json({ status: "error", message: "User not found" });
    }

    const otp = await createOTPFun(user.phone);

    let sendingResult;

    if (phone) {
      try {
        await sendSMS(user.phone, `Your OTP for forget password is ${otp}`);
        console.log("user phone", user.phone);
        sendingResult = "SMS sent successfully";
      } catch (smsError) {
        console.error("Error sending SMS:", smsError.message);
        sendingResult = "Error in sending SMS";
      }
    } else {
      const mailSend = await sendEmail({
        email: user.email,
        subject: "OTP for forget password",
        text: `Your OTP for forget password is ${otp}`,
        html: `<p>Your Makely Pro OTP ( One Time Passcode ) For Forget Password is : <b>${otp}</b>.
        <br />
        OTP Is Valid For 05 Mins
        <br />
        Please Don't Share Your OTP With Anyone For Your Account Security
        <br />
        Thank You</p>`,
      });

      if (!mailSend) {
        sendingResult = "Error in sending email";
      } else {
        sendingResult = "Email sent successfully";
      }
    }

    res.status(201).json({
      status: "success",
      message: `OTP sent successfully. ${sendingResult}`,
    });
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
    const userData = await getUserData(user);
    res.status(200).json({
      status: "success",
      data: {
        user: userData,
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
    const userData = await getUserData(user);
    res.status(200).json({
      status: "success",
      data: {
        user: userData,
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
    if (myUser.role !== "admin" && myUser.role !== "owner") {
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
  checkTokenIsValidApi,
  verifyOtpApi,
  forgetPasswordApi,
  resetPasswordApi,
  changePasswordApi,
  logoutApi,
  getUserProfileApi,
  updataUserProfileApi,
  getAllUsersApi,
};

const getUserData = async (user) => {
  let services = {
    websiteService: false,
    bookingService: false,
  };

  if (user.role === "owner") {
    const ownerData = await Owner.findOne({ ownerId: user._id });
    if (ownerData) {
      services = {
        websiteService: ownerData.websiteService,
        bookingService: ownerData.bookingService,
      };
    }
  }
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    image: imgFullPath(user.image),
    role: user.role,
    createdAt: user.createdAt,
    verified: user.verified,
    verifyAt: user.verifyAt,
    services,
  };
};
