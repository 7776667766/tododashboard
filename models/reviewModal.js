
const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({

    businessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Business",
        required: [true, "Business Id is required"],
    },

    title: {
        type: String
    },

    description: {
        type: String
    },

    rating: {
        type: Number,
        required: [true, "Rating is required"],
        min: 1,
        max: 5,
    },

    image: {
        type: String
    },

    deletedAt: {
        type: Date,
        default: Date.now,
    },

    deletedAt: {  
        type: Date,
    },
});

module.exports = mongoose.model("Review", reviewSchema);