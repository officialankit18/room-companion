import { Router } from "express";

import {
  createOwnerListing,
  deleteOwnerListing,
  fillOwnerListing,
  getListingDetails,
  listActiveListings,
  listTenantMatchedListings,
  updateOwnerListing,
} from "../controllers/listing.controller.js";
import { USER_ROLES } from "../constants/roles.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/authorize.middleware.js";
import { uploadListingImages } from "../middleware/upload.middleware.js";
import { validateRequest } from "../middleware/validation.middleware.js";
import { mongoIdParamValidator } from "../validators/common.validator.js";
import {
  createListingValidator,
  listingQueryValidator,
  updateListingValidator,
} from "../validators/listing.validator.js";

const router = Router();

router.get("/", listingQueryValidator, validateRequest, listActiveListings);
router.get(
  "/matches",
  authenticate,
  authorizeRoles(USER_ROLES.TENANT),
  listingQueryValidator,
  validateRequest,
  listTenantMatchedListings
);
router.get("/:id", mongoIdParamValidator("id"), validateRequest, getListingDetails);

router.post(
  "/",
  authenticate,
  authorizeRoles(USER_ROLES.OWNER),
  uploadListingImages.array("images", 5),
  createListingValidator,
  validateRequest,
  createOwnerListing
);

router.patch(
  "/:id",
  authenticate,
  authorizeRoles(USER_ROLES.OWNER),
  mongoIdParamValidator("id"),
  updateListingValidator,
  validateRequest,
  updateOwnerListing
);

router.patch(
  "/:id/filled",
  authenticate,
  authorizeRoles(USER_ROLES.OWNER),
  mongoIdParamValidator("id"),
  validateRequest,
  fillOwnerListing
);

router.delete(
  "/:id",
  authenticate,
  authorizeRoles(USER_ROLES.OWNER),
  mongoIdParamValidator("id"),
  validateRequest,
  deleteOwnerListing
);

export default router;
