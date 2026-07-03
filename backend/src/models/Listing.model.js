import mongoose from "mongoose";

import {
  FURNISHING_STATUS_VALUES,
  LISTING_STATUS,
  LISTING_STATUS_VALUES,
  ROOM_TYPE_VALUES,
} from "../constants/listing.js";

const listingImageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const listingSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 120,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 20,
      maxlength: 1000,
    },
    location: {
      city: {
        type: String,
        required: true,
        trim: true,
        index: true,
      },
      locality: {
        type: String,
        required: true,
        trim: true,
        index: true,
      },
      address: {
        type: String,
        trim: true,
        default: null,
      },
      flatNumber: {
        type: String,
        trim: true,
        default: null,
      },
      building: {
        type: String,
        trim: true,
        default: null,
      },
      landmark: {
        type: String,
        trim: true,
        default: null,
      },
      displayAddress: {
        type: String,
        trim: true,
        default: null,
      },
      state: {
        type: String,
        trim: true,
        default: null,
      },
      country: {
        type: String,
        trim: true,
        default: null,
      },
      pincode: {
        type: String,
        trim: true,
        default: null,
      },
      latitude: {
        type: Number,
        min: -90,
        max: 90,
        default: null,
      },
      longitude: {
        type: Number,
        min: -180,
        max: 180,
        default: null,
      },
    },
    rent: {
      type: Number,
      required: true,
      min: 1,
      index: true,
    },
    availableFrom: {
      type: Date,
      required: true,
      index: true,
    },
    roomType: {
      type: String,
      required: true,
      enum: ROOM_TYPE_VALUES,
    },
    furnishingStatus: {
      type: String,
      required: true,
      enum: FURNISHING_STATUS_VALUES,
    },
    images: {
      type: [listingImageSchema],
      required: true,
      validate: {
        validator: (images) => images.length >= 1 && images.length <= 5,
        message: "Listing must contain 1 to 5 images",
      },
    },
    status: {
      type: String,
      enum: LISTING_STATUS_VALUES,
      default: LISTING_STATUS.ACTIVE,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

listingSchema.index({ "location.city": 1, status: 1 });
listingSchema.index({ "location.latitude": 1, "location.longitude": 1 });
listingSchema.index({ rent: 1, status: 1 });
listingSchema.index({ createdAt: -1 });

export const Listing = mongoose.model("Listing", listingSchema);
