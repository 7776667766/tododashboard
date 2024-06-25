const validator = require("validator");
const Booking = require("../models/BookingModal");
const Specialist = require("../models/SpecialistModel");
const Business = require("../models/BusinessModal");
const Service = require("../models/Service/ServiceModel");
const User = require("../models/UserModel");
const { sendEmail } = require("../util/sendEmail");
const imgFullPath = require("../util/imgFullPath");
const { makelyLogo } = require("../util/assets");
require("dotenv").config();

const addBookingApi = async (req, res, next) => {
  try {
    if (req.user === undefined) {
      return res.status(400).json({ status: "error", message: "Invalid user" });
    }
    const { id } = req.user;
    const user = await User.findById(id);

    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "User not found",
      });
    }

    const latestBooking = await Booking.findOne(
      {},
      {},
      { sort: { token: -1 } }
    );
    const nextSerialNumber = (latestBooking && latestBooking.token + 1) || 1;

    const {
      serviceId,
      specialistId,
      businessId,
      name,
      // phone,
      date,
      timeSlot,
      status,
      price,
    } = req.body;

    if (
      !serviceId ||
      !specialistId ||
      !businessId ||
      !name ||
      // !phone ||
      !date ||
      !timeSlot ||
      !price
    ) {
      return res.status(400).json({
        status: "error",
        message: "All fields are required",
      });
    }

    if (!validator.isMongoId(serviceId)) {
      return res.status(400).json({
        status: "error",
        message: "Service is invalid",
      });
    }

    if (!validator.isMongoId(specialistId)) {
      return res.status(400).json({
        status: "error",
        message: "Specialist id is invalid",
      });
    }

    if (!validator.isMongoId(businessId)) {
      return res.status(400).json({
        status: "error",
        message: "Business id  is invalid",
      });
    }

    const business = await Business.findById(businessId);

    if (!business) {
      return res.status(400).json({
        status: "error",
        message: "Business not found",
      });
    }

    const businessOwner = await User.findById(business.createdBy);

    if (!businessOwner) {
      return res.status(400).json({
        status: "error",
        message: "Onwer associated with business not found",
      });
    }

    const newBooking = await Booking.create({
      serviceId,
      specialistId,
      userId: user._id,
      businessId,
      token: nextSerialNumber,
      name,
      // phone,
      date,
      status,
      timeSlot,
      price,
    });
    ///user notification
    // const userMailSend = await sendEmail({
    //   email: user.email,
    //   subject: "Booking Confirmation",

    // });

    // if (!userMailSend || !businessOwnerMailSend) {
    //   console.error("Error sending confirmation emails");
    //   return res.status(500).json({
    //     status: "error",
    //     message: "Error sending confirmation emails",
    //   });
    // }
    const myBookingData = await getBookingData(newBooking);
    res.status(200).json({
      status: "success",
      data: myBookingData,
      message: "Booking added successfully",
    });
  } catch (error) {
    console.error("Error in creating booking", error);

    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const getBookingByBusinessApi = async (req, res, next) => {
  console.log("body of booking", req.body);
  try {
    if (req.user === undefined) {
      return res.status(400).json({ status: "error", message: "Invalid user" });
    }
    const { id } = req.user;
    const user = await User.findById(id);
    console.log("user", user);
    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "User not found",
      });
    }

    if (
      user.role === "manager" ||
      user.role === "owner" ||
      user.role === "admin"
    ) {
      const { businessId } = req.body;
      console.log("businessId22222", businessId);
      let myBookings = [];
      const bookings = await Booking.find({
        businessId: businessId,
        active: true,
      });

      await Promise.all(
        bookings.map(async (booking) => {
          const myBookingData = await getBookingData(booking);
          myBookings.push(myBookingData);
        })
      );
      console.log("myBookings----123", myBookings);
      return res.status(200).json({
        status: "success",
        data: myBookings,
        message: "All bookings retrieved successfully",
      });
    } else {
      res.status(400).json({
        status: "error",
        message: "You are not authorized to get all bookings",
      });
    }
  } catch (error) {
    console.error("Error in getting all bookings", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const updateBookingApi = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { id } = req.user;
    const {
      serviceId,
      specialistId,
      businessId,
      name,
      phone,
      date,
      timeSlot,
      price,
      status,
    } = req.body;

    if (!bookingId) {
      return res.status(400).json({
        status: "error",
        message: "Booking Id is required",
      });
    }

    if (!validator.isMongoId(bookingId)) {
      return res.status(400).json({
        status: "error",
        message: "Booking Id is invalid",
      });
    }

    if (serviceId) {
      if (!validator.isMongoId(serviceId)) {
        return res.status(400).json({
          status: "error",
          message: "Service Id is invalid",
        });
      }

      const isServiceExist = await Service.findById(serviceId);
      if (!isServiceExist) {
        return res.status(400).json({
          status: "error",
          message: "Service does not exist",
        });
      }
    }

    if (specialistId) {
      if (!validator.isMongoId(specialistId)) {
        return res.status(400).json({
          status: "error",
          message: "Specialist Id is invalid",
        });
      }

      const isSpecialistExist = await Specialist.findById(specialistId);
      if (!isSpecialistExist) {
        return res.status(400).json({
          status: "error",
          message: "Specialist does not exist",
        });
      }
    }

    if (businessId) {
      if (!validator.isMongoId(businessId)) {
        return res.status(400).json({
          status: "error",
          message: "Business Id is invalid",
        });
      }

      const isBusinessExist = await Business.findById(businessId);
      if (!isBusinessExist) {
        return res.status(400).json({
          status: "error",
          message: "Business does not exist",
        });
      }
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(400).json({
        status: "error",
        message: "Booking not found",
      });
    }

    if (booking.ownerId != id) {
      return res.status(400).json({
        status: "error",
        message: "You are not authorized to update this booking",
      });
    }

    await Booking.updateOne(
      { _id: bookingId },
      status
        ? { $set: { name, phone, date, timeSlot, price, status } }
        : { $set: { name, phone, date, timeSlot, price } }
    );

    res.status(200).json({
      status: "success",
      message: "Booking updated successfully",
    });
  } catch (error) {
    console.log("Error in updating booking", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const getBookedTimeSlots = async (req, res, next) => {
  try {
    const { serviceId, date } = req.body;
    if (!serviceId) {
      return res.status(400).json({
        status: "error",
        message: "Service Id is required",
      });
    }
    if (!date) {
      return res.status(400).json({
        status: "error",
        message: "Date is required",
      });
    }

    const startDate = new Date(date).setHours(0, 0, 0, 0);
    const endDate = new Date(date).setHours(23, 59, 59, 999);

    const bookedTimeSlots = await Booking.find({
      serviceId,
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    }).distinct("timeSlot");

    return res.status(200).json({
      status: "success",
      data: bookedTimeSlots,
      message: "Booked Time Slots",
    });
  } catch (error) {
    console.error("Error Fetching Booked Time Slots:", error);
    return res.status(500).json({
      status: "error",
      message: error,
    });
  }
};

const getBookingbyUserId = async (req, res) => {
  try {
    if (req.user === undefined) {
      return res.status(400).json({ status: "error", message: "Invalid user" });
    }
    const { id } = req.user;

    const mybooking = [];
    const bookings = await Booking.find({ userId: id });

    await Promise.all(
      bookings.map(async (booking) => {
        const myBookingData = await getBookingData(booking);
        mybooking.push(myBookingData);
      })
    );
    res.status(200).json({
      status: "success",
      data: mybooking,
    });
  } catch (error) {
    console.error("Error Fetching in Booking By User Id:", error);
    return res.status(500).json({
      status: "error",
      message: error,
    });
  }
};

const deleteBookingApi = async (req, res, next) => {
  try {
    const { bookingId } = req.params;

    if (!bookingId || !validator.isMongoId(bookingId)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid service type id",
      });
    }

    const mybooking = await Booking.findById(bookingId);

    if (!mybooking) {
      return res.status(400).json({
        status: "error",
        message: "Booking not found",
      });
    }
    await Booking.findByIdAndUpdate(
      { _id: bookingId },
      { deletedAt: new Date() }
    );

    res.status(200).json({
      status: "success",
      message: "Service deleted successfully",
    });
  } catch (error) {
    console.log("Error in deleting service", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const cancelBookingApi = async (req, res, next) => {
  try {
    const { bookingId } = req.params;

    if (req.user === undefined) {
      return res.status(400).json({ status: "error", message: "Invalid user" });
    }

    const { id } = req.user;

    const user = await User.findById(id);

    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "User not found",
      });
    }

    if (!bookingId) {
      return res.status(400).json({
        status: "error",
        message: "Booking Id is required",
      });
    }

    if (!validator.isMongoId(bookingId)) {
      return res.status(400).json({
        status: "error",
        message: "Booking Id Id is invalid",
      });
    }

    const updatedBooking = await Booking.findOneAndUpdate(
      { _id: bookingId },
      { $set: { status: "cancelled" } },
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(400).json({
        status: "error",
        message: "Booking not found",
      });
    }

    const userMailSend = await sendEmail({
      email: user.email,
      subject: "Booking Cancellation",
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
              <div style="text-align: center;margin-top: 10px; padding-top: 20px;"> <img src="${makelyLogo}"  width="160px" height="auto" alt="MakelyPro">
              </div>
          <div><p style="text-align: center;font-weight: 500;font-size: 26px;font-family: 'Poppins', sans-serif;font-size: 18px;color: #000000;">Booking Cancel</p></div>
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

    if (!userMailSend) {
      console.error("Error sending confirmation emails");
      return res.status(500).json({
        status: "error",
        message: "Error sending confirmation emails",
      });
    }

    const updateddata = await getBookingData(updatedBooking);
    res.status(200).json({
      status: "success",
      data: updateddata,
      message: "Booking Status Cancelled Successfully",
    });
  } catch (error) {
    console.log("Error in update booking", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const completeBookingApi = async (req, res, next) => {
  try {
    const { bookingId } = req.params;

    if (!bookingId) {
      return res.status(400).json({
        status: "error",
        message: "Booking Id is required",
      });
    }

    if (!validator.isMongoId(bookingId)) {
      return res.status(400).json({
        status: "error",
        message: "Booking Id  is invalid",
      });
    }

    const updatedBooking = await Booking.findOneAndUpdate(
      { _id: bookingId },
      { $set: { status: "completed" } },
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(400).json({
        status: "error",
        message: "Booking Id is invalid",
      });
    }

    const updateddata = await getBookingData(updatedBooking);
    res.status(200).json({
      status: "success",
      data: updateddata,
      message: "Booking Status Updated Successfully",
    });
  } catch (error) {
    console.log("Error in update booking", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const resehduledBookingApi = async (req, res, next) => {
  try {
    const { date, timeSlot } = req.body;
    const { bookingId } = req.params;
    const reseheduleBooking = await Booking.findOneAndUpdate(
      { _id: bookingId },
      {
        $set: {
          date: new Date(date),
          timeSlot: timeSlot,
          status: "rescheduled",
        },
      },
      { new: true }
    );

    const updateddata = await getBookingData(reseheduleBooking);
    res.status(200).json({
      status: "success",
      data: updateddata,
      message: "Booking Rescheduled Successfully",
    });
  } catch (error) {
    console.log("Error in Rescheduled booking", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

module.exports = {
  addBookingApi,
  updateBookingApi,
  getBookingByBusinessApi,
  getBookingbyUserId,
  getBookedTimeSlots,
  completeBookingApi,
  deleteBookingApi,
  cancelBookingApi,
  resehduledBookingApi,
};

const getBookingData = async (data) => {
  const { specialistId, businessId, serviceId } = data;
  const specialist = await Specialist.findById(specialistId).select({
    _id: 0,
    name: 1,
    id: {
      $toString: "$_id",
    },
    phone: 1,
  });

  const businessData = await Business.findById(businessId).select({
    _id: 1,
    name: 1,
    logo: 1,
    address: 1,
  });

  const serviceData = await Service.findById(serviceId)
    .select({
      _id: 1,
      name: 1,
      image: 1,
      timeSlots: 1,
      timeInterval: 1,
    })
    .exec();

  const myBookingData = {
    id: data._id,
    name: data.name,
    phone: data.phone,
    price: data.price,
    date: data.date,
    specialist: specialist,
    timeSlot: data.timeSlot,
    status: data.status,
    token: data.token,
    business: businessData && {
      id: businessData._id,
      name: businessData.name,
      address: businessData.address,
      logo: imgFullPath(businessData.logo),
    },
    service: serviceData && {
      id: serviceData._id,
      name: serviceData.name,
      image: imgFullPath(serviceData.image),
      timeSlots: serviceData.timeSlots,
      timeInterval: serviceData.timeInterval,
    },
  };

  return myBookingData;
};
