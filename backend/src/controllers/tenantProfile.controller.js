import { HTTP_STATUS } from "../constants/httpStatus.js";
import { TENANT_PROFILE_MESSAGES } from "../constants/messages.js";
import {
  getTenantProfile,
  upsertTenantProfile,
} from "../services/tenantProfile.service.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const saveTenantProfile = asyncHandler(async (req, res) => {
  const profile = await upsertTenantProfile({
    tenantId: req.user.id,
    body: req.body,
  });

  return sendSuccess(res, HTTP_STATUS.OK, TENANT_PROFILE_MESSAGES.UPSERTED, {
    profile,
  });
});

export const fetchTenantProfile = asyncHandler(async (req, res) => {
  const profile = await getTenantProfile(req.user.id);

  return sendSuccess(res, HTTP_STATUS.OK, TENANT_PROFILE_MESSAGES.FETCHED, {
    profile,
  });
});

