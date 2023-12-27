const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Cardholder Name is required'],
    trim: true,
  },

  stripePaymentMethodId: {
    type: String,
    required: true,
  },

  // stripePaymentIntentId: {
  //   type: String,
  //   required: true,
  // },

  subscriptionPlan :{
    type:String,

  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  deletedAt: {
    type: Date,
  },
});

const Card = mongoose.model('Card', cardSchema);

module.exports = Card;
