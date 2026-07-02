import dns from "node:dns";

import mongoose from "mongoose";

import { appConfig } from "./app.config.js";

export const connectDatabase = async () => {
  const mongoUri = process.env.MONGO_URI;
  const dnsServers = process.env.DNS_SERVERS;

  if (dnsServers) {
    dns.setServers(dnsServers.split(",").map((server) => server.trim()));
  }

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
