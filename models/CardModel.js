const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Cardholder Name is required"],
    trim: true,
  },

  credit: {
    type: String,
    trim: true,
    unique: true, 
  },

  days: {
    type: String,
    required: [true, "Expiration Date is required"],
    trim: true,
  },

  cvv: {
    type: String,
    trim: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  deletedAt: {
    type : Date
  }
  
});

const Card = mongoose.model("Card", cardSchema);

module.exports = Card;
