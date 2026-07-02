import { HTTP_STATUS } from "../constants/httpStatus.js";
import { SECURITY_MESSAGES } from "../constants/messages.js";
import { AppError } from "../utils/AppError.js";

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      throw new AppError(SECURITY_MESSAGES.FORBIDDEN, HTTP_STATUS.FORBIDDEN);
    }

    next();
  };
};

