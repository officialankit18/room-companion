import { Router } from "express";

import {
  reversePropertyLocation,
  searchPropertyLocations,
} from "../controllers/location.controller.js";
import { USER_ROLES } from "../constants/roles.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/authorize.middleware.js";
import { validateRequest } from "../middleware/validation.middleware.js";
import {
  locationSearchValidator,
  reverseGeocodeValidator,
} from "../validators/location.validator.js";

const router = Router();

router.use(authenticate, authorizeRoles(USER_ROLES.OWNER));
router.get("/search", locationSearchValidator, validateRequest, searchPropertyLocations);
router.get("/reverse", reverseGeocodeValidator, validateRequest, reversePropertyLocation);

export default router;
