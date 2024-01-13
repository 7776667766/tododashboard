const mongoose = require("mongoose");

const serviceTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  image: {
    type: String,
  },
  slug: {
    type: String,
    required: [true, "Slug is required"],
    unique: true,
  },
  deletedAt: {
    type: Date,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User is required"],
  },
});

module.exports = mongoose.model("ServiceType", serviceTypeSchema);
