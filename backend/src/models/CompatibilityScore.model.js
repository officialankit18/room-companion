import mongoose from "mongoose";

import {
  COMPATIBILITY_SCORE,
  COMPATIBILITY_SOURCE_VALUES,
} from "../constants/compatibility.js";

const compatibilityScoreSchema = new mongoose.Schema(
  {
    tenantId: {
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
    score: {
      type: Number,
      required: true,
      min: COMPATIBILITY_SCORE.MIN,
      max: COMPATIBILITY_SCORE.MAX,
    },
    explanation: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    source: {
      type: String,
      enum: COMPATIBILITY_SOURCE_VALUES,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

compatibilityScoreSchema.index({ tenantId: 1, listingId: 1 }, { unique: true });
compatibilityScoreSchema.index({ tenantId: 1, score: -1 });

export const CompatibilityScore = mongoose.model(
  "CompatibilityScore",
  compatibilityScoreSchema
);

