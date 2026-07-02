import mongoose from "mongoose";

import { ROOM_TYPE_VALUES } from "../constants/listing.js";

const tenantProfileSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    preferredLocation: {
      city: {
        type: String,
        required: true,
        trim: true,
        index: true,
      },
      locality: {
        type: String,
        trim: true,
        default: null,
        index: true,
      },
    },
    budget: {
      min: {
        type: Number,
        required: true,
        min: 1,
      },
      max: {
        type: Number,
        required: true,
        min: 1,
      },
    },
    moveInDate: {
      type: Date,
      required: true,
      index: true,
    },
    preferredRoomType: {
      type: String,
      enum: ROOM_TYPE_VALUES,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

tenantProfileSchema.index({ "preferredLocation.city": 1, "budget.max": 1 });

export const TenantProfile = mongoose.model("TenantProfile", tenantProfileSchema);

