const mongoose = require("mongoose");

const templateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  description: {
    type: String,
    trim: true
  },
  slug: {
    type: String,
    required: [true, "Slug is required"],
    trim: true,
  },
  bookingImage: {
    type: String,
    required: [true, "BookingImage is required"],

    trim: true,
  },
  fontFamily: {
    type: String,
  },
  fontSize: {
    type: Number
  },
  websiteImage: {
    type: String,
    required: [true, "WebsiteImage is required"],
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
