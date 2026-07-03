import { query } from "express-validator";

export const locationSearchValidator = [
  query("q")
    .trim()
    .isLength({ min: 3, max: 160 })
    .withMessage("Search must be between 3 and 160 characters"),
];

export const reverseGeocodeValidator = [
  query("latitude")
    .isFloat({ min: -90, max: 90 })
    .withMessage("Valid latitude is required"),
  query("longitude")
    .isFloat({ min: -180, max: 180 })
    .withMessage("Valid longitude is required"),
];
