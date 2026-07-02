import { HTTP_STATUS } from "../constants/httpStatus.js";
import { TENANT_PROFILE_MESSAGES } from "../constants/messages.js";
import { TenantProfile } from "../models/TenantProfile.model.js";
import { AppError } from "../utils/AppError.js";

export const upsertTenantProfile = async ({ tenantId, body }) => {
  const profile = await TenantProfile.findOneAndUpdate(
    { tenantId },
    {
      tenantId,
      preferredLocation: {
        city: body.city,
        locality: body.locality || null,
      },
      budget: {
        min: Number(body.minBudget),
        max: Number(body.maxBudget),
      },
      moveInDate: body.moveInDate,
      preferredRoomType: body.preferredRoomType || null,
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    }
  );

  return profile;
};

export const getTenantProfile = async (tenantId) => {
  const profile = await TenantProfile.findOne({ tenantId });

  if (!profile) {
    throw new AppError(TENANT_PROFILE_MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  return profile;
};

