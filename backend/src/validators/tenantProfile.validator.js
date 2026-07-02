import { body } from "express-validator";

import { ROOM_TYPE_VALUES } from "../constants/listing.js";
import { TENANT_PROFILE_BUDGET } from "../constants/tenantProfile.js";

export const tenantProfileValidator = [
  body("city").trim().notEmpty().withMessage("Preferred city is required"),
  body("locality").optional().trim(),
  body("minBudget")
    .isFloat({ min: TENANT_PROFILE_BUDGET.MIN, max: TENANT_PROFILE_BUDGET.MAX })
    .withMessage("Valid minimum budget is required"),
  body("maxBudget")
    .isFloat({ min: TENANT_PROFILE_BUDGET.MIN, max: TENANT_PROFILE_BUDGET.MAX })
    .withMessage("Valid maximum budget is required")
    .custom((maxBudget, { req }) => Number(maxBudget) >= Number(req.body.minBudget))
    .withMessage("Maximum budget must be greater than or equal to minimum budget"),
  body("moveInDate").isISO8601().withMessage("Valid move-in date is required"),
  body("preferredRoomType").optional().isIn(ROOM_TYPE_VALUES),
];

