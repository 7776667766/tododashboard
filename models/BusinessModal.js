const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema({

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
    unique: true,
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
    required: [true, "Google Id is required"],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    trim: true,
    required: [true, "Owner Id is required"],
  },

  bookingService: { type: Boolean, default: false },
  websiteService: { type: Boolean, default: false },
  theme:{ type:String},
  createdAt: {
    type: Date,
    default: new Date(),
  },

  deletedAt: {
    type: Date,
  },
});

module.exports = mongoose.model("Business", businessSchema);
