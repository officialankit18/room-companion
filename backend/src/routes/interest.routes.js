import { Router } from "express";

import {
  acceptInterest,
  createInterest,
  declineInterest,
  fetchOwnerInterests,
  fetchTenantInterests,
} from "../controllers/interest.controller.js";
import { USER_ROLES } from "../constants/roles.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/authorize.middleware.js";
import { validateRequest } from "../middleware/validation.middleware.js";
import { mongoIdParamValidator } from "../validators/common.validator.js";

const router = Router();

router.use(authenticate);

router.post(
  "/listings/:listingId",
  authorizeRoles(USER_ROLES.TENANT),
  mongoIdParamValidator("listingId"),
  validateRequest,
  createInterest
);

router.get("/tenant", authorizeRoles(USER_ROLES.TENANT), fetchTenantInterests);
router.get("/owner", authorizeRoles(USER_ROLES.OWNER), fetchOwnerInterests);

router.patch(
  "/:id/accept",
  authorizeRoles(USER_ROLES.OWNER),
  mongoIdParamValidator("id"),
  validateRequest,
  acceptInterest
);

router.patch(
  "/:id/decline",
  authorizeRoles(USER_ROLES.OWNER),
  mongoIdParamValidator("id"),
  validateRequest,
  declineInterest
);

export default router;

