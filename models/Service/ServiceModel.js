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
  type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ServiceType",
    required: [true, "Type is required"],
    trim: true,
  },
  specialist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: [true, "Specialist is required"],
    trim: true,
  },
  timeSlots: {
    type: Array,
    required: [true, "TimeSlots is required"],
    trim: true,
  },
  shopkeeperId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Shopkeeper is required"],
  },
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Business",
    required: [true, "Business is required"],
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
