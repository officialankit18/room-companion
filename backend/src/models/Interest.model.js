import mongoose from "mongoose";

import { INTEREST_STATUS, INTEREST_STATUS_VALUES } from "../constants/interest.js";

const interestSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    listingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: INTEREST_STATUS_VALUES,
      default: INTEREST_STATUS.PENDING,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

interestSchema.index({ tenantId: 1, listingId: 1 }, { unique: true });
interestSchema.index({ ownerId: 1, status: 1, createdAt: -1 });

export const Interest = mongoose.model("Interest", interestSchema);

