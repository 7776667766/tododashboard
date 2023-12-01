const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    trim: true,
  },
  image: {
    type: String,
    required: [true, "Image is required"],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    trim: true,
  },
  date: {
    type: Date,
    required: [true, "Date is required"],
    trim: true,
  },
  typeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ServiceType",
    required: [true, "Type is required"],
    trim: true,
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
  timeSlots: {
    type: Array,
    required: [true, "TimeSlots is required"],
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
});

module.exports = mongoose.model("Service", serviceSchema);
