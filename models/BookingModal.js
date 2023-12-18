const mongoose = require("mongoose");


const bookingSchema = new mongoose.Schema({
    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
        required: [true, "Service is required"],
    },
    specialistId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
        path: "specialistId",
    },
    businessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
        path: "businessId",
    },
    name: {
        type: String,
        required: [true, "Customer name is required"],
        trim: true,
    },
    phone: {
        type: String,
        required: [true, "Customer phone is required"],
        trim: true,
    },
    date: {
        type: Date,
        required: [true, "Date is required"],
        trim: true,
    },
    timeSlot: {
        type: String,
        required: [true, "Time slot is required"],
        trim: true,
    },
    price: {
        type: Number,
        required: [true, "Total price is required"],
        trim: true,
    },
    createdAt: {
        type: Date,
        default: new Date(),
    },
    deletedAt: {
        type: Date,
    },
    active: {
        type: Boolean,
        default: true,
    },
    status: {
        type: String,
        enum: ["pending", "complete","cancel"],
        default: "pending",
    },
});

module.exports = mongoose.model("Booking", bookingSchema);
