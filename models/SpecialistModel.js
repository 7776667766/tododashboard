const mongoose = require("mongoose");

const specialistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  deletedAt: {
    type: Date,
  },
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Business",
    required: [true, "Business is required"],
  },
});

module.exports = mongoose.model("specialist", specialistSchema);
