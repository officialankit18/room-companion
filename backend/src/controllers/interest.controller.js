import { HTTP_STATUS } from "../constants/httpStatus.js";
import { INTEREST_MESSAGES } from "../constants/messages.js";
import {
  acceptInterestRequest,
  declineInterestRequest,
  getOwnerInterests,
  getTenantInterests,
  sendInterestRequest,
} from "../services/interest.service.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createInterest = asyncHandler(async (req, res) => {
  const data = await sendInterestRequest({
    tenantId: req.user.id,
    listingId: req.params.listingId,
  });

  return sendSuccess(res, HTTP_STATUS.CREATED, INTEREST_MESSAGES.CREATED, data);
});

export const fetchTenantInterests = asyncHandler(async (req, res) => {
  const interests = await getTenantInterests(req.user.id);

  return sendSuccess(res, HTTP_STATUS.OK, INTEREST_MESSAGES.TENANT_HISTORY_FETCHED, {
    interests,
  });
});

export const fetchOwnerInterests = asyncHandler(async (req, res) => {
  const interests = await getOwnerInterests(req.user.id);

  return sendSuccess(res, HTTP_STATUS.OK, INTEREST_MESSAGES.OWNER_REQUESTS_FETCHED, {
    interests,
  });
});

export const acceptInterest = asyncHandler(async (req, res) => {
  const data = await acceptInterestRequest({
    ownerId: req.user.id,
    interestId: req.params.id,
  });

  return sendSuccess(res, HTTP_STATUS.OK, INTEREST_MESSAGES.ACCEPTED, data);
});

export const declineInterest = asyncHandler(async (req, res) => {
  const interest = await declineInterestRequest({
    ownerId: req.user.id,
    interestId: req.params.id,
  });

  return sendSuccess(res, HTTP_STATUS.OK, INTEREST_MESSAGES.DECLINED, { interest });
});

