const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: [true, "Service is required"],
  },
  specialistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Specialist",
    required: [true, "Specialist Id is required"],
    trim: true,
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "owner Id is required"],
  },

  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Business",
    required: [true, "Business Id is required"],
  },

  name: {
    type: String,
    required: [true, "Customer name is required"],
    trim: true,
  },
  phone: {
    type: String,
    required: [true, "Customer phone is required"],
    trim: true,
  },
  date: {
    type: Date,
    required: [true, "Date is required"],
    trim: true,
  },
  timeSlot: {
    type: String,
    required: [true, "Time slot is required"],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "Total price is required"],
    trim: true,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  deletedAt: {
    type: Date,
  },
  active: {
    type: Boolean,
    default: true,
  },
  status: {
    type: String,
    enum: ["Delivered", "Pending", "Cancelled"],
    default: "Pending",
  },
});

module.exports = mongoose.model("Booking", bookingSchema);
