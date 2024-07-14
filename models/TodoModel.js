const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "title is required"],
  },
  
  description: {
    type: String,
    required: [true, "Description is required"],
  },

  completed: {
    type: Boolean,
    default: false,
  },

  createdAt: {
    type: Date,
    default: new Date(),
  },
 
  deletedAt: {
    type: Date,
  },
});

module.exports = mongoose.model("Todo", todoSchema);
