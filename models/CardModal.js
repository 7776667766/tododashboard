const mongoose = require('mongoose');

const saveCardSchema = new mongoose.Schema({
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  cardname: {
    type: String,
    trim: true,
  },

  check: {
    type: String,
  },

  name: {
    type: String,
  },
  
  duration: {
    type: String,
  },

  price: {
    type: Number,
  },

  features: {
    type: [String],
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
 
  cardType: {
    type: String, 
  },
  cardDigits: {
    type: String, 
  },
  expiryDate: {
    type: String, 
  },

  deletedAt: {
    type: Date,
  },
});

const Card = mongoose.model('Card', saveCardSchema);

module.exports = Card;
