import { appConfig } from "../config/app.config.js";

export const requestLogger = (req, res, next) => {
  if (appConfig.nodeEnv === "test") {
    return next();
  }

  const startedAt = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - startedAt;
    console.info(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
  });

  return next();
};

