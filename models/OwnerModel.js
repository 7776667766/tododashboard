const mongooes = require("mongoose");

const ownerSchema = new mongooes.Schema({
  ownerId: {
    type: mongooes.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Owner Id is required"],
    trim: true,
  },
  bookingService: {
    type: Boolean,
    default: false,
  },
  websiteService: {
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

module.exports = mongooes.model("Owner", ownerSchema);
