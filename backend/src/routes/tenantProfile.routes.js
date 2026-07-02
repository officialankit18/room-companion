import { Router } from "express";

import {
  fetchTenantProfile,
  saveTenantProfile,
} from "../controllers/tenantProfile.controller.js";
import { USER_ROLES } from "../constants/roles.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/authorize.middleware.js";
import { validateRequest } from "../middleware/validation.middleware.js";
import { tenantProfileValidator } from "../validators/tenantProfile.validator.js";

const router = Router();

router.use(authenticate, authorizeRoles(USER_ROLES.TENANT));

router.get("/me", fetchTenantProfile);
router.put("/me", tenantProfileValidator, validateRequest, saveTenantProfile);

export default router;

