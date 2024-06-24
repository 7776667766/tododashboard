const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
  businessId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Business",
    required: [true, "Business ID is required"],

  },
  name: {
    type: String,
    required: [true, 'name Name is required'],
    trim: true,
  },

  slug: {
    type: String,
    required: [true, 'Slug Name is required'],
    trim: true,
  },

});

const Card = mongoose.model('BusinessRequest', businessSchema);

module.exports = Card;
