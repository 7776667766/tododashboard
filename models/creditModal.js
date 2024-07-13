const mongoose = require("mongoose");

const creditSchema = new mongoose.Schema({
  amount: {
    type: String,
    required: [true, "Credit Amount is required"],
    trim: true,
  },
  credit: {
    type: String,
  },
  email: {
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
  status: {
    type: Date,
    default: true,
  },
});

module.exports = mongoose.model("Credit", creditSchema);
