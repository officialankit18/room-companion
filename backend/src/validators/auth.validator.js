import { body } from "express-validator";

import { PASSWORD_POLICY } from "../constants/auth.js";
import { PUBLIC_REGISTER_ROLE_VALUES } from "../constants/roles.js";

const passwordRule = body("password")
  .isLength({ min: PASSWORD_POLICY.MIN_LENGTH })
  .withMessage("Password must be at least 8 characters long")
  .matches(/[a-z]/)
  .withMessage("Password must contain a lowercase letter")
  .matches(/[A-Z]/)
  .withMessage("Password must contain an uppercase letter")
  .matches(/[0-9]/)
  .withMessage("Password must contain a number")
  .matches(/[^A-Za-z0-9]/)
  .withMessage("Password must contain a special character");

export const registerValidator = [
  body("name").trim().isLength({ min: 2, max: 80 }).withMessage("Name is required"),
  body("email").trim().isEmail().normalizeEmail().withMessage("Valid email is required"),
  passwordRule,
  body("role").isIn(PUBLIC_REGISTER_ROLE_VALUES).withMessage("Valid role is required"),
];

export const verifyEmailValidator = [
  body("email").trim().isEmail().normalizeEmail().withMessage("Valid email is required"),
  body("otp").isLength({ min: 6, max: 6 }).isNumeric().withMessage("Valid OTP is required"),
];

export const resendOtpValidator = [
  body("email").trim().isEmail().normalizeEmail().withMessage("Valid email is required"),
];

export const loginValidator = [
  body("email").trim().isEmail().normalizeEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];
