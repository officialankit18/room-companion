import { HTTP_STATUS } from "../constants/httpStatus.js";
import { reverseGeocode, searchLocations } from "../services/location.service.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const searchPropertyLocations = asyncHandler(async (req, res) => {
  const locations = await searchLocations(req.query.q);
  return sendSuccess(res, HTTP_STATUS.OK, "Locations fetched", { locations });
});

export const reversePropertyLocation = asyncHandler(async (req, res) => {
  const location = await reverseGeocode(req.query);
  return sendSuccess(res, HTTP_STATUS.OK, "Address fetched", { location });
});
