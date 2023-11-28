const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
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
    lowercase: true,
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
  password: {
    type: String,
    required: [true, "Password is required"],
    trim: true,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  verified: {
    type: Boolean,
    default: false,
  },
  verifyAt: {
    type: Date,
  },
});

userSchema.pre("save", function (next) {
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

module.exports = mongoose.model("User", userSchema);
