import dotenv from "dotenv";

dotenv.config({ quiet: true });

const parseCsv = (value) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const frontendUrls = parseCsv(
  process.env.FRONTEND_URLS || process.env.FRONTEND_URL || "http://localhost:5173,http://127.0.0.1:5173"
);

export const appConfig = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 5000,
  frontendUrl: frontendUrls[0],
  frontendUrls,
  backendUrl: process.env.BACKEND_URL || "http://localhost:5000",
};
