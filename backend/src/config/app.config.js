import dotenv from "dotenv";

dotenv.config({ quiet: true });

const parseCsv = (value) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const frontendUrls = parseCsv(
  process.env.FRONTEND_URLS ||
    process.env.FRONTEND_URL ||
    "http://localhost:5173,http://127.0.0.1:5173,http://localhost:5174,http://127.0.0.1:5174"
);

const isLocalFrontendOrigin = (origin) =>
  /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);

const isRoomCompanionVercelOrigin = (origin) =>
  /^https:\/\/roomcompanion[-\w]*\.vercel\.app$/.test(origin);

export const appConfig = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 5000,
  frontendUrl: frontendUrls[0],
  frontendUrls,
  isAllowedOrigin(origin) {
    return (
      !origin ||
      frontendUrls.includes(origin) ||
      isLocalFrontendOrigin(origin) ||
      isRoomCompanionVercelOrigin(origin)
    );
  },
  backendUrl: process.env.BACKEND_URL || "http://localhost:5000",
};
