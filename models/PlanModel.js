// name duration price description featured

const mongoose = require("mongoose");

const planSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Plan name is required"],
  },
  duration: {
    type: String,
    required: [true, "Plan duration is required"],
  },
  price: {
    type: Number,
    required: [true, "Plan price is required"],
  },

  description: {
    type: String,
    required: [true, "Plan description is required"],
  },

  isFeatured: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
  deletedAt: {
    type: Date,
  },
});

module.exports = mongoose.model("Plan", planSchema);
