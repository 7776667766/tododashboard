
const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    description: {
      type: String,
      required: [true, "description is required"],
      trim: true,
    },
    name: {
      type: String,
      required: [true, "name is required"],
      trim: true,
    },
  
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: 1,
      max: 5,
    },
    profileLogo:{
      type:String,
      }
  });
  
const BuisnessRequestSchema = new mongoose.Schema({

    status: {
        type: String,
        enum: ["rejected", "pending", "appproved"],
        default: "pending",
    },

    active: {
        type: Boolean,
        default: true,
      },
      
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        trim: true,
    },

    name: {
        type: String,
        trim: true,
        required: [true, "Name is required"],
    },

    email: {
        type: String,
        trim: true,
        required: [true, "Email is required"],
    },

    reviews: [reviewSchema],

    businessTiming: {
        type: [
            {
                day: String,
                from: String,
                to: String,
                active: Boolean,
            },
        ],
    },
    googleMap: {
        type: String,
    },

    businessId: {
        type: String,
      },
      
    TransactionDates: [
        {
            type: Date,
        },
    ],

    slug: {
        type: String,
        required: [true, "Slug is required"],
        unique: true,
    },
    galleryImg: [
        {
            type: String,
        },
    ],

    profileLogo: [
        {
            type: String,
        },
    ],

    bannerText: {
        type: String,
    },

    bannerImg: {
        type: String,
    },

    color: {
        type: String,
    },

    fontFamily: {
        type: String,
    },

    fontSize: {
        type: Number,
    },

    logo: {
        type: String,
    },

    phone: {
        code: {
            type: String,
        },
        number: {
            type: String,
            trim: true,
        },
    },

    description: {
        type: String,
        trim: true,
        required: [true, "Description is required"],
    },

    address: {
        type: String,
        trim: true,
        required: [true, "Address is required"],
    },

    ownerName:{
        type: String,
    
      },

    socialLinks: {
        type: Array,
        trim: true,
    },

    googleId: {
        type: String,
        trim: true,
    },

    requestStatus: {
        type: String,
        enum: ["approved", "rejected", "pending"],
        default: "pending",
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        trim: true,
    },

    bookingService: { type: Boolean, default: false },
    websiteService: { type: Boolean, default: false },

    theme: {
        type: String,
    },

    rejectreason: {
        type: String,
        default: "payment is not clear",
    },

    createdAt: {
        type: Date,
        default: new Date(),
    },

    deletedAt: {
        type: Date,
    },

    status: {
        type: String,
        enum: ["true", "rejected", "pending"],
        default: "pending",
    },

    payment: {
        type: "String"
    },


});

module.exports = mongoose.model("BusinesseditRequest" , BuisnessRequestSchema);