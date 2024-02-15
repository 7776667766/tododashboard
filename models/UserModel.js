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
    countryCode: {
      type: String,
    },
    phoneNumber: {
      type: String,
      trim: true,
      unique: true,
    },
  },

  image: {
    type: String,
    default: "/uploads/user-image.jpg",
    trim: true,
  },
  role: {
    type: String,
    enum: ["admin", "user", "owner", "manager"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    length: [8, "Password must be atleast 8 characters long"],
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
  deletedAt: {
    type: Date,
  },
});

userSchema.pre("save", function (next) {
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

module.exports = mongoose.model("User", userSchema);
