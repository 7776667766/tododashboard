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
    default:
      "https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0=",
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
