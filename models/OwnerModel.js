const mongoose = require("mongoose");

const ownerSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    // required: [true, "Owner Id is required"],
    trim: true,
  },
  // businessId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Business",
  //   required: [true, "Business Id is required"],
  // },
  theme: {
    type: String,
    trim: true,
  },
  fontFamily: {
    type: String,
  },
  fontSize: {
    type: Number
  },

  rejectreason: {
    type: String,
  },

  bookingService: {
    type: Boolean,
    default: false,
  },
  websiteService: {
    type: Boolean,
    default: false,
  },

  bannerText: {
    type: String,
    trim: true,
  },

  bannerImge: {
    type: String,

  },
  color: {
    type: String,
    trim: true,
  },

  createdAt: {
    type: Date,
    default: new Date(),
  },
  deletedAt: {
    type: Date,
  },
});

module.exports = mongoose.model("Owner", ownerSchema);
