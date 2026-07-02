import { appConfig } from "../config/app.config.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";
import { sendError } from "../utils/apiResponse.js";

export const notFoundHandler = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = HTTP_STATUS.NOT_FOUND;
  next(error);
};

export const globalErrorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const message =
    error.isOperational || appConfig.nodeEnv === "development"
      ? error.message
      : "Something went wrong";

  const errors =
    appConfig.nodeEnv === "development" && error.stack
      ? [{ stack: error.stack }]
      : [];

  return sendError(res, statusCode, message, errors);
};

