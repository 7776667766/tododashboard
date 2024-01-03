const mongoose = require("mongoose");

const ownerSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Owner Id is required"],
    trim: true,
  },
  theme: {
    type: String
  },
  services: [
    {
      name: {
        type: String,
        required: true,
        enum: ["booking", "website"],
      },
      selected: {
        type: Boolean,
        default: false,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: new Date(),
  },
  deletedAt: {
    type: Date,
  },
});

module.exports = mongoose.model("Owner", ownerSchema);
