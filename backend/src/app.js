import cors from "cors";
import express from "express";

import { appConfig } from "./config/app.config.js";
import { globalErrorHandler, notFoundHandler } from "./middleware/error.middleware.js";
import healthRoutes from "./routes/health.routes.js";

const app = express();

app.use(
  cors({
    origin: appConfig.frontendUrl,
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/", healthRoutes);

app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;

