import mongoose from "mongoose";

import { appConfig } from "./app.config.js";

export const connectDatabase = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    if (appConfig.nodeEnv !== "production") {
      console.warn("MONGO_URI is not set. Skipping MongoDB connection in development.");
      return;
    }

    throw new Error("MONGO_URI is required");
  }

  await mongoose.connect(mongoUri);
  console.log("MongoDB connected successfully");
};
