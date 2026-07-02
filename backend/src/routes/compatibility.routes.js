import { Router } from "express";

import { getListingCompatibility } from "../controllers/compatibility.controller.js";
import { USER_ROLES } from "../constants/roles.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/authorize.middleware.js";
import { validateRequest } from "../middleware/validation.middleware.js";
import { mongoIdParamValidator } from "../validators/common.validator.js";

const router = Router();

router.get(
  "/listings/:listingId",
  authenticate,
  authorizeRoles(USER_ROLES.TENANT),
  mongoIdParamValidator("listingId"),
  validateRequest,
  getListingCompatibility
);

export default router;

