const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  price: {
    type: String,
  },
  phoneNumber: {
    type: Number
  },
  verificationCode: {
    type: Number,
  }, 
  stripeSubscriptionEndDate: {
    type: Number,
},
  name: {
    type: String,
    trim: true,
  },

  stripePaymentMethodId: {
    type: String,
  },
  duration:{
    type: String,
  },

  stripeCustomerId: {
    type: String,
  },
  stripeSubscriptionId: {
    type: String,
  },
  check: {
    type: String,
  },
  subscriptionPlan: {
    type: String,
  },
  token: {
    type: String,
  },
  amount: {
    type: Number,
  },
  clientSecret:{
    type: String 
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
  createdAt: {
    type: Date,
    default: Date.now,
  },

  deletedAt: {
    type: Date,
  },
});

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
