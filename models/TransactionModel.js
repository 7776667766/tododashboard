const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Service is required"],
  },
  price: {
    type: String,
  },

  name: {
    type: String,
    required: [true, "Cardholder Name is required"],
    trim: true,
  },

  stripePaymentMethodId: {
    type: String,
    required: true,
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
