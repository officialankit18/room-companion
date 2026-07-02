import { COMPATIBILITY_SOURCE } from "../constants/compatibility.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";
import {
  COMPATIBILITY_MESSAGES,
  LISTING_MESSAGES,
} from "../constants/messages.js";
import { LISTING_STATUS } from "../constants/listing.js";
import { CompatibilityScore } from "../models/CompatibilityScore.model.js";
import { Listing } from "../models/Listing.model.js";
import { TenantProfile } from "../models/TenantProfile.model.js";
import { AppError } from "../utils/AppError.js";
import { calculateGeminiCompatibility } from "./ai/geminiCompatibility.provider.js";
import { calculateRuleBasedCompatibility } from "./ai/ruleBasedCompatibility.provider.js";

const runCompatibilityEngine = async ({ tenantProfile, listing }) => {
  try {
    const result = await calculateGeminiCompatibility({ tenantProfile, listing });
    console.info("AI compatibility generated", {
      tenantId: tenantProfile.tenantId.toString(),
      listingId: listing._id.toString(),
    });
    return result;
  } catch (error) {
    console.error("AI compatibility failed. Using rule-based fallback", error.message);
    return calculateRuleBasedCompatibility({ tenantProfile, listing });
  }
};

export const getOrCreateCompatibilityScore = async ({ tenantId, listingId }) => {
  const existingScore = await CompatibilityScore.findOne({ tenantId, listingId });

  if (existingScore) {
    return existingScore;
  }

  const [tenantProfile, listing] = await Promise.all([
    TenantProfile.findOne({ tenantId }),
    Listing.findById(listingId),
  ]);

  if (!tenantProfile) {
    throw new AppError(COMPATIBILITY_MESSAGES.PROFILE_REQUIRED, HTTP_STATUS.BAD_REQUEST);
  }

  if (!listing || listing.status === LISTING_STATUS.INACTIVE) {
    throw new AppError(LISTING_MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  const result = await runCompatibilityEngine({ tenantProfile, listing });

  return CompatibilityScore.findOneAndUpdate(
    { tenantId, listingId },
    {
      tenantId,
      listingId,
      score: result.score,
      explanation: result.explanation,
      source: result.source || COMPATIBILITY_SOURCE.RULE_BASED,
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    }
  );
};

export const deleteCompatibilityForListing = async (listingId) => {
  await CompatibilityScore.deleteMany({ listingId });
};

export const deleteCompatibilityForTenant = async (tenantId) => {
  await CompatibilityScore.deleteMany({ tenantId });
};

