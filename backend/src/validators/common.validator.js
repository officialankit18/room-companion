import { param } from "express-validator";

import { VALIDATION_MESSAGES } from "../constants/messages.js";
import { isValidObjectId } from "../helpers/isValidObjectId.js";

export const mongoIdParamValidator = (fieldName = "id") => [
  param(fieldName)
    .custom((value) => isValidObjectId(value))
    .withMessage(VALIDATION_MESSAGES.INVALID_ID),
];

