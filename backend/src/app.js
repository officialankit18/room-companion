import cors from "cors";
import express from "express";

import { appConfig } from "./config/app.config.js";
import { globalErrorHandler, notFoundHandler } from "./middleware/error.middleware.js";
import { requestLogger } from "./middleware/requestLogger.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import healthRoutes from "./routes/health.routes.js";
import listingRoutes from "./routes/listing.routes.js";

const app = express();

app.use(
  cors({
    origin: appConfig.frontendUrl,
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

app.use("/", healthRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/listings", listingRoutes);

app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
