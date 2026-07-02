import { Router } from "express";

import {
  fetchAdminListings,
  fetchAdminUsers,
  fetchPlatformActivity,
  updateAdminListingStatus,
  updateAdminUserStatus,
} from "../controllers/admin.controller.js";
import { USER_ROLES } from "../constants/roles.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/authorize.middleware.js";
import { validateRequest } from "../middleware/validation.middleware.js";
import {
  adminListingQueryValidator,
  adminUserQueryValidator,
  updateListingStatusValidator,
  updateUserStatusValidator,
} from "../validators/admin.validator.js";
import { mongoIdParamValidator } from "../validators/common.validator.js";

const router = Router();

router.use(authenticate, authorizeRoles(USER_ROLES.ADMIN));

router.get("/activity", fetchPlatformActivity);
router.get("/users", adminUserQueryValidator, validateRequest, fetchAdminUsers);
router.patch(
  "/users/:id/status",
  mongoIdParamValidator("id"),
  updateUserStatusValidator,
  validateRequest,
  updateAdminUserStatus
);
router.get("/listings", adminListingQueryValidator, validateRequest, fetchAdminListings);
router.patch(
  "/listings/:id/status",
  mongoIdParamValidator("id"),
  updateListingStatusValidator,
  validateRequest,
  updateAdminListingStatus
);

export default router;

