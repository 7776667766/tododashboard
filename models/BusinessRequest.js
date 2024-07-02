const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema({
  description: {
    type: String,
    required: [true, "Description is required"],
    trim: true,
  },

  googleBusiness: {
    type: String,
    required: [true, "Google Business is required"],
    trim: true,
  },
  ownerName: {
    type: String,
    // required: [true, "Google Business is required"],
    trim: true,
  },
  ownerId: {
    type: String,
    // required: [true, "Google Business is required"],
    trim: true,
  },
});

const Buisness = mongoose.model("BusinessRequest", businessSchema);

module.exports = Buisness;
