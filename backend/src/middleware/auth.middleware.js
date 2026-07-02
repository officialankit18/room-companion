import jwt from "jsonwebtoken";

import { AUTH_MESSAGES } from "../constants/messages.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";
import { User } from "../models/User.model.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const authenticate = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    throw new AppError("Authentication failed", HTTP_STATUS.UNAUTHORIZED);
  }

  const token = authHeader.split(" ")[1];
  if (!process.env.JWT_SECRET) {
    throw new AppError("Authentication service is not configured", HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new AppError("Authentication failed", HTTP_STATUS.UNAUTHORIZED);
  }

  const user = await User.findById(decoded.userId);

  if (!user || !user.isActive) {
    throw new AppError(AUTH_MESSAGES.INVALID_CREDENTIALS, HTTP_STATUS.UNAUTHORIZED);
  }

  if (!user.isVerified) {
    throw new AppError(AUTH_MESSAGES.EMAIL_VERIFICATION_REQUIRED, HTTP_STATUS.FORBIDDEN);
  }

  req.user = {
    id: user._id.toString(),
    role: user.role,
  };

  next();
});
