import { body, query } from "express-validator";

import {
  FURNISHING_STATUS_VALUES,
  LISTING_PAGINATION,
  ROOM_TYPE_VALUES,
} from "../constants/listing.js";

export const createListingValidator = [
  body("title").trim().isLength({ min: 5, max: 120 }).withMessage("Title is required"),
  body("description")
    .trim()
    .isLength({ min: 20, max: 1000 })
    .withMessage("Description must be 20 to 1000 characters"),
  body("city").trim().notEmpty().withMessage("City is required"),
  body("locality").trim().notEmpty().withMessage("Locality is required"),
  body("address").optional().trim(),
  body("rent").isFloat({ min: 1 }).withMessage("Valid rent is required"),
  body("availableFrom").isISO8601().withMessage("Valid available date is required"),
  body("roomType").isIn(ROOM_TYPE_VALUES).withMessage("Valid room type is required"),
  body("furnishingStatus")
    .isIn(FURNISHING_STATUS_VALUES)
    .withMessage("Valid furnishing status is required"),
];

export const updateListingValidator = [
  body("title").optional().trim().isLength({ min: 5, max: 120 }),
  body("description").optional().trim().isLength({ min: 20, max: 1000 }),
  body("city").optional().trim().notEmpty(),
  body("locality").optional().trim().notEmpty(),
  body("address").optional().trim(),
  body("rent").optional().isFloat({ min: 1 }),
  body("availableFrom").optional().isISO8601(),
  body("roomType").optional().isIn(ROOM_TYPE_VALUES),
  body("furnishingStatus").optional().isIn(FURNISHING_STATUS_VALUES),
];

export const listingQueryValidator = [
  query("city").optional().trim(),
  query("locality").optional().trim(),
  query("roomType").optional().isIn(ROOM_TYPE_VALUES),
  query("furnishingStatus").optional().isIn(FURNISHING_STATUS_VALUES),
  query("minRent").optional().isFloat({ min: 1 }),
  query("maxRent").optional().isFloat({ min: 1 }),
  query("availableFrom").optional().isISO8601(),
  query("sort").optional().isIn(["newest", "lowestRent", "highestRent", "highestCompatibility"]),
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1, max: LISTING_PAGINATION.MAX_LIMIT }),
];
