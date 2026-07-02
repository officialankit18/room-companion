import {
  COMPATIBILITY_SOURCE,
  COMPATIBILITY_WEIGHTS,
} from "../../constants/compatibility.js";

const normalize = (value) => value?.toString().trim().toLowerCase() || "";

const scoreLocation = (tenantProfile, listing) => {
  const tenantCity = normalize(tenantProfile.preferredLocation.city);
  const tenantLocality = normalize(tenantProfile.preferredLocation.locality);
  const listingCity = normalize(listing.location.city);
  const listingLocality = normalize(listing.location.locality);

  if (tenantLocality && tenantLocality === listingLocality) {
    return COMPATIBILITY_WEIGHTS.LOCATION;
  }

  if (tenantCity === listingCity) {
    return Math.round(COMPATIBILITY_WEIGHTS.LOCATION * 0.8);
  }

  if (listingCity.includes(tenantCity) || tenantCity.includes(listingCity)) {
    return Math.round(COMPATIBILITY_WEIGHTS.LOCATION * 0.5);
  }

  return 0;
};

const scoreBudget = (tenantProfile, listing) => {
  const rent = listing.rent;
  const { min, max } = tenantProfile.budget;

  if (rent >= min && rent <= max) {
    return COMPATIBILITY_WEIGHTS.BUDGET;
  }

  const tolerance = max * 0.1;

  if (rent > max && rent <= max + tolerance) {
    return Math.round(COMPATIBILITY_WEIGHTS.BUDGET * 0.6);
  }

  if (rent < min) {
    return Math.round(COMPATIBILITY_WEIGHTS.BUDGET * 0.8);
  }

  return 0;
};

const scoreMoveIn = (tenantProfile, listing) => {
  const moveInDate = new Date(tenantProfile.moveInDate);
  const availableFrom = new Date(listing.availableFrom);

  if (availableFrom <= moveInDate) {
    return COMPATIBILITY_WEIGHTS.MOVE_IN;
  }

  const daysLate = Math.ceil((availableFrom - moveInDate) / (1000 * 60 * 60 * 24));

  return daysLate <= 7 ? Math.round(COMPATIBILITY_WEIGHTS.MOVE_IN * 0.5) : 0;
};

const buildExplanation = (tenantProfile, listing) => {
  const cityMatches =
    normalize(tenantProfile.preferredLocation.city) === normalize(listing.location.city);
  const budgetMatches =
    listing.rent >= tenantProfile.budget.min && listing.rent <= tenantProfile.budget.max;
  const dateMatches = new Date(listing.availableFrom) <= new Date(tenantProfile.moveInDate);

  return [
    cityMatches ? "Location matches the tenant preference." : "Location is not an exact match.",
    budgetMatches
      ? "Rent is within the preferred budget range."
      : "Rent is outside the preferred budget range.",
    dateMatches ? "Availability fits the move-in date." : "Availability is later than preferred.",
  ].join(" ");
};

export const calculateRuleBasedCompatibility = ({ tenantProfile, listing }) => {
  const score =
    scoreLocation(tenantProfile, listing) +
    scoreBudget(tenantProfile, listing) +
    scoreMoveIn(tenantProfile, listing);

  return {
    score: Math.max(0, Math.min(100, score)),
    explanation: buildExplanation(tenantProfile, listing),
    source: COMPATIBILITY_SOURCE.RULE_BASED,
  };
};

