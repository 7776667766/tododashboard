const validator = require("validator");
const Booking = require("../models/BookingModal");
const Specialist = require("../models/SpecialistModel");
const Business = require("../models/BusinessModal");
const Service = require('../models/Service/ServiceModel')

const addBookingApi = async (req, res, next) => {
    try {
        const {
            serviceId,
            specialistId,
            businessId,
            name,
            phone,
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
            !phone ||
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

        // const isServiceExist = await Service.findById(serviceId);
        // if (!isServiceExist) {
        //     return res.status(400).json({
        //         status: "error",
        //         message: "Service id does not exist",
        //     });
        // }

        const isSpecialistExist = await Specialist.findById(specialistId);
        if (!isSpecialistExist) {
            return res.status(400).json({
                status: "error",
                message: "Specialis id does not exist",
            });
        }

        const isBusinessExist = await Business.findById(businessId);
        if (!isBusinessExist) {
            return res.status(400).json({
                status: "error",
                message: "Business does not exist",
            });
        }

        const newBooking = await Booking.create({
            serviceId,
            specialistId,
            businessId,
            name,
            phone,
            date,
            status,
            timeSlot,
            price,
        });

        res.status(200).json({
            status: "success",
            data: newBooking,
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

const getAllBookingsApi = async (req, res, next) => {
    try {
        const bookings = await Booking.find();

        res.status(200).json({
            status: "success",
            data: bookings,
            message: "All bookings retrieved successfully",
        });
    } catch (error) {
        console.error("Error in getting all bookings", error);

        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
};

  const updateBookingApi = async (req, res, next) => {
    try {
    
      const { bookingId } = req.params;
      const { id } = req.user;

      const { serviceId, specialistId, businessId, name, phone, date, timeSlot, price,status } = req.body;

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

      await Booking.updateOne({ _id: bookingId }, status ? { $set: { name, phone, date, timeSlot, price, status } } : { $set: { name, phone, date, timeSlot, price } });

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

module.exports = {
    addBookingApi,
    updateBookingApi,
    getAllBookingsApi
};
