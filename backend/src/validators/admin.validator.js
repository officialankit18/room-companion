import { body, query } from "express-validator";

import { LISTING_STATUS_VALUES } from "../constants/listing.js";
import { USER_ROLE_VALUES } from "../constants/roles.js";

export const adminUserQueryValidator = [
  query("role").optional().isIn(USER_ROLE_VALUES),
  query("isVerified").optional().isBoolean(),
  query("isActive").optional().isBoolean(),
  query("search").optional().trim(),
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1, max: 50 }),
];

export const adminListingQueryValidator = [
  query("status").optional().isIn(LISTING_STATUS_VALUES),
  query("city").optional().trim(),
  query("search").optional().trim(),
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1, max: 50 }),
];

export const updateUserStatusValidator = [
  body("isActive").isBoolean().withMessage("isActive must be boolean"),
];

export const updateListingStatusValidator = [
  body("status").isIn(LISTING_STATUS_VALUES).withMessage("Valid listing status is required"),
];

