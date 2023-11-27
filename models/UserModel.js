const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    lowercase: true,
  },
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  phone: {
    type: String,
    required: [true, "Phone is required"],
    trim: true,
    unique: true,
  },
  image: {
    type: String,
    required: [true, "Image is required"],
    trim: true,
  },
  role: {
    type: String,
    enum: ["admin", "user", "shopkeeper", "manager"],
    default: "user",
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

module.exports = mongoose.model("User", userSchema);
