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
  profileLogo: {
    type: String,
    // required:[true,"Profile Logo is required"]
  },
});

const businessSchema = new mongoose.Schema({
  businessId: {
    type: String,
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

  // timeSlots: {
  //   type: [
  //     {
  //       day: String,
  //       startTime: String,
  //       endTime: String,
  //       active: Boolean,
  //     },
  //   ],
  //   default: [
  //     {
  //       day: "Monday",
  //       startTime: "09:00 AM",
  //       endTime: "05:00 PM",
  //       active: true,
  //     },
  //     {
  //       day: "Tuesday",
  //       startTime: "09:00 AM",
  //       endTime: "05:00 PM",
  //       active: true,
  //     },
  //     {
  //       day: "Wednesday",
  //       startTime: "09:00 AM",
  //       endTime: "05:00 PM",
  //       active: true,
  //     },
  //     {
  //       day: "Thursday",
  //       startTime: "09:00 AM",
  //       endTime: "05:00 PM",
  //       active: true,
  //     },
  //     {
  //       day: "Friday",
  //       startTime: "09:00 AM",
  //       endTime: "05:00 PM",
  //       active: true,
  //     },
  //     {
  //       day: "Saturday",
  //       startTime: "07:00 AM",
  //       endTime: "04:00 PM",
  //       active: true,
  //     },
  //   ],
  //   trim: true,
  // },

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

  socialLinks: {
    type: Array,
    trim: true,
  },

  // images: {
  //   type: Array,
  //   trim: true,
  // },

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
    type: String,
  },
});

module.exports = mongoose.model("Business", businessSchema);
