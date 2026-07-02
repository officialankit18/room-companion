import { HTTP_STATUS } from "../constants/httpStatus.js";
import { LISTING_MESSAGES } from "../constants/messages.js";
import {
  createListing,
  getListingById,
  getListings,
  getTenantMatchedListings,
  markListingFilled,
  removeListing,
  updateListing,
} from "../services/listing.service.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createOwnerListing = asyncHandler(async (req, res) => {
  const listing = await createListing({
    ownerId: req.user.id,
    body: req.body,
    files: req.files,
  });

  return sendSuccess(res, HTTP_STATUS.CREATED, LISTING_MESSAGES.CREATED, { listing });
});

export const listActiveListings = asyncHandler(async (req, res) => {
  const data = await getListings(req.query);

  return sendSuccess(res, HTTP_STATUS.OK, LISTING_MESSAGES.FETCHED, data);
});

export const listTenantMatchedListings = asyncHandler(async (req, res) => {
  const data = await getTenantMatchedListings({
    tenantId: req.user.id,
    query: req.query,
  });

  return sendSuccess(res, HTTP_STATUS.OK, LISTING_MESSAGES.FETCHED, data);
});

export const getListingDetails = asyncHandler(async (req, res) => {
  const listing = await getListingById(req.params.id);

  return sendSuccess(res, HTTP_STATUS.OK, LISTING_MESSAGES.DETAILS_FETCHED, { listing });
});

export const updateOwnerListing = asyncHandler(async (req, res) => {
  const listing = await updateListing({
    listingId: req.params.id,
    ownerId: req.user.id,
    body: req.body,
  });

  return sendSuccess(res, HTTP_STATUS.OK, LISTING_MESSAGES.UPDATED, { listing });
});

export const fillOwnerListing = asyncHandler(async (req, res) => {
  const listing = await markListingFilled({
    listingId: req.params.id,
    ownerId: req.user.id,
  });

  return sendSuccess(res, HTTP_STATUS.OK, LISTING_MESSAGES.MARKED_FILLED, { listing });
});

export const deleteOwnerListing = asyncHandler(async (req, res) => {
  const listing = await removeListing({
    listingId: req.params.id,
    ownerId: req.user.id,
  });

  return sendSuccess(res, HTTP_STATUS.OK, LISTING_MESSAGES.DELETED, { listing });
});
