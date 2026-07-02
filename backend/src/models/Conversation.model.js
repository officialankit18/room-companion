import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
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
    tenantUnread: {
      type: Number,
      default: 0,
      min: 0,
    },
    ownerUnread: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

conversationSchema.index({ tenantId: 1, ownerId: 1, listingId: 1 }, { unique: true });

export const Conversation = mongoose.model("Conversation", conversationSchema);

