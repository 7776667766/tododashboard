// name duration price description featured

const mongoose = require("mongoose");

const planSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
    },
    duration: {
        type: String,
        trim: true,
    },
    price: {
        type: String,
        required: [true, "Price is required"],
    },

    description: {
        type: String,
        required: [true, "description is required"],
    },

    features: {
        type: String,

    },
    createdAt: {
        type: Date,
        default: new Date(),
    },

    deletedAt: {
        type: Date,
    },
});



module.exports = mongoose.model("Plan", planSchema);
