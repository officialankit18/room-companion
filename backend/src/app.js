import cors from "cors";
import express from "express";

import { appConfig } from "./config/app.config.js";
import { globalErrorHandler, notFoundHandler } from "./middleware/error.middleware.js";
import { requestLogger } from "./middleware/requestLogger.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import compatibilityRoutes from "./routes/compatibility.routes.js";
import conversationRoutes from "./routes/conversation.routes.js";
import healthRoutes from "./routes/health.routes.js";
import interestRoutes from "./routes/interest.routes.js";
import listingRoutes from "./routes/listing.routes.js";
import tenantProfileRoutes from "./routes/tenantProfile.routes.js";

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
app.use("/api/v1/compatibility", compatibilityRoutes);
app.use("/api/v1/conversations", conversationRoutes);
app.use("/api/v1/interests", interestRoutes);
app.use("/api/v1/listings", listingRoutes);
app.use("/api/v1/tenant-profile", tenantProfileRoutes);

app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
