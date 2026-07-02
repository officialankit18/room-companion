import { validationResult } from "express-validator";

import { HTTP_STATUS } from "../constants/httpStatus.js";
import { VALIDATION_MESSAGES } from "../constants/messages.js";
import { sendError } from "../utils/apiResponse.js";

export const validateRequest = (req, res, next) => {
  const result = validationResult(req);

  if (result.isEmpty()) {
    return next();
  }

  const errors = result.array().map((error) => ({
    field: error.path,
    message: error.msg,
  }));

  return sendError(
    res,
    HTTP_STATUS.VALIDATION_ERROR,
    VALIDATION_MESSAGES.INVALID_REQUEST,
    errors
  );
};

