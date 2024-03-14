const mongoose = require("mongoose");

const ownerSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    trim: true,
  },

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
  
  timeSlots: {
    type: [
      {
        day: String,
        startTime: String,
        endTime: String,
        active: Boolean,
      },
    ],
    trim: true,
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
