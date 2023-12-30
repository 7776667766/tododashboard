const mongoose = require("mongoose");

const templateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  slug: {
    type: String,
    required: [true, "Slug is required"],
    trim: true,
  },
  bookingImage: {
    type: String,
    required: [true, " Booking Image is required"],
    trim: true,
  },
  websiteImage: {
    type: String,
    required: [true, " Image is required"],
    trim: true,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
  deletedAt: {
    type: Date,
  },
});

module.exports = mongoose.model("Template", templateSchema);
