const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Phone is required"],
        trim: true,
    },
    message: {
        type: String,
        required: [true, "Message is required"]
    },
    createdAt: {
        type: Date,
        default: new Date(),
    },
    deletedAt: {
        type: Date,
    },

});

module.exports = mongoose.model("Contact", contactSchema);
