import { HTTP_STATUS } from "../constants/httpStatus.js";
import { ADMIN_MESSAGES } from "../constants/messages.js";
import {
  getAdminListings,
  getAdminUsers,
  getPlatformActivity,
  updateListingStatusByAdmin,
  updateUserStatus,
} from "../services/admin.service.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const fetchAdminUsers = asyncHandler(async (req, res) => {
  const data = await getAdminUsers(req.query);

  return sendSuccess(res, HTTP_STATUS.OK, ADMIN_MESSAGES.USERS_FETCHED, data);
});

export const updateAdminUserStatus = asyncHandler(async (req, res) => {
  const user = await updateUserStatus({
    adminId: req.user.id,
    userId: req.params.id,
    isActive: req.body.isActive,
  });

  return sendSuccess(res, HTTP_STATUS.OK, ADMIN_MESSAGES.USER_UPDATED, { user });
});

export const fetchAdminListings = asyncHandler(async (req, res) => {
  const data = await getAdminListings(req.query);

  return sendSuccess(res, HTTP_STATUS.OK, ADMIN_MESSAGES.LISTINGS_FETCHED, data);
});

export const updateAdminListingStatus = asyncHandler(async (req, res) => {
  const listing = await updateListingStatusByAdmin({
    listingId: req.params.id,
    status: req.body.status,
  });

  return sendSuccess(res, HTTP_STATUS.OK, ADMIN_MESSAGES.LISTING_UPDATED, { listing });
});

export const fetchPlatformActivity = asyncHandler(async (req, res) => {
  const activity = await getPlatformActivity();

  return sendSuccess(res, HTTP_STATUS.OK, ADMIN_MESSAGES.ACTIVITY_FETCHED, { activity });
});

