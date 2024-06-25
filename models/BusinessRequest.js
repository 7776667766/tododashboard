const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
  ownerId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Owner",
  },
  description: {
    type: String,
    required: [true, 'description is required'],
    trim: true,
  },

  googleBusiness: {
    type: String,
    required: [true, 'Google Business is required'],
    trim: true,
  },

});

const Buisness = mongoose.model('BusinessRequest', businessSchema);

module.exports = Buisness;
