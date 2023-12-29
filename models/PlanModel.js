// name duration price description featured

const mongoose = require("mongoose");

const planSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    name: {
        type: String,
        
    },
    duration: {
        type: String,
    },
    price: {
        type: String,
        
    },

    description: {
        type: String,
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
