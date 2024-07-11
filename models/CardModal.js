const mongoose = require('mongoose');

const saveCardSchema = new mongoose.Schema({
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  cardname: {
    type: String,
    required: [true, 'Cardholder Name is required'],
    trim: true,
  },

  check: {
    type: String,
  },

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

  features: {
    type: [String],
    required: [true, "Features is required"],
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
