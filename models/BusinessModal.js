const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema({
  businessId:{
    type:String,
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    trim: true,
  },
  name: {
    type: String,
    trim: true,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    trim: true,
    required: [true, "Email is required"],
  },

  slug: {
    type: String,
    required: [true, "Slug is required"],
    unique: true,
  },

  bannerText: {
    type: String,
  },

  bannerImg: {
    type: String,
  },

  color: {
    type: String,
  },
  fontFamily: {
    type: String,
  },
  fontSize: {
    type: Number
  },

  logo: {
    type: String,
  },
  phone: {
    type: String,
    trim: true,
    required: [true, "Phone is required"],
  },
  description: {
    type: String,
    trim: true,
    required: [true, "Description is required"],
  },
  address: {
    type: String,
    trim: true,
    required: [true, "Address is required"],
  },
  socialLinks: {
    type: Array,
    trim: true,
  },
  images: {
    type: Array,
    trim: true,
  },
  googleId: {
    type: String,
    trim: true,
  },
  requestStatus: {
    type: String,
    enum: ["approved", "rejected", "pending"],
    default: "pending",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    trim: true,
  },

  bookingService: { type: Boolean, default: false },
  websiteService: { type: Boolean, default: false },

  theme: {
    type: String,
  },

  rejectreason: {
    type: String,
    default: "payment is not clear"
  },

  createdAt: {
    type: Date,
    default: new Date(),
  },

  deletedAt: {
    type: Date,
  },

  status: {
    type: String,
    enum: ["true", "rejected", "pending"],
    default: "pending",
  },
  payment: {
    type: String,
  }

});

module.exports = mongoose.model("Business", businessSchema);
