import { HTTP_STATUS } from "../constants/httpStatus.js";
import { SECURITY_MESSAGES } from "../constants/messages.js";
import { sendError } from "../utils/apiResponse.js";

const buckets = new Map();

export const createRateLimiter = ({ windowMs, maxRequests }) => {
  return (req, res, next) => {
    const key = `${req.ip}:${req.originalUrl}`;
    const now = Date.now();
    const bucket = buckets.get(key);

    if (!bucket || bucket.expiresAt <= now) {
      buckets.set(key, {
        count: 1,
        expiresAt: now + windowMs,
      });
      return next();
    }

    if (bucket.count >= maxRequests) {
      return sendError(
        res,
        HTTP_STATUS.TOO_MANY_REQUESTS || 429,
        SECURITY_MESSAGES.TOO_MANY_REQUESTS
      );
    }

    bucket.count += 1;
    return next();
  };
};

