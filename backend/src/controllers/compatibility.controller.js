import { COMPATIBILITY_MESSAGES } from "../constants/messages.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";
import { getOrCreateCompatibilityScore } from "../services/compatibility.service.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getListingCompatibility = asyncHandler(async (req, res) => {
  const compatibility = await getOrCreateCompatibilityScore({
    tenantId: req.user.id,
    listingId: req.params.listingId,
  });

  return sendSuccess(res, HTTP_STATUS.OK, COMPATIBILITY_MESSAGES.FETCHED, {
    compatibility,
  });
});

