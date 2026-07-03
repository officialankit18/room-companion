import { HTTP_STATUS } from "../constants/httpStatus.js";
import { AppError } from "../utils/AppError.js";

const NOMINATIM_BASE_URL =
  process.env.NOMINATIM_BASE_URL || "https://nominatim.openstreetmap.org";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const REQUEST_INTERVAL_MS = 1100;
const resultCache = new Map();
let requestQueue = Promise.resolve();
let nextRequestAt = 0;

const getCached = (key) => {
  const cached = resultCache.get(key);
  if (!cached || cached.expiresAt < Date.now()) {
    resultCache.delete(key);
    return null;
  }
  return cached.value;
};

const setCached = (key, value) => {
  if (resultCache.size >= 200) {
    resultCache.delete(resultCache.keys().next().value);
  }
  resultCache.set(key, { value, expiresAt: Date.now() + CACHE_TTL_MS });
};

const scheduleRequest = (request) => {
  const scheduled = requestQueue.then(async () => {
    const waitMs = Math.max(0, nextRequestAt - Date.now());
    if (waitMs) {
      await new Promise((resolve) => setTimeout(resolve, waitMs));
    }
    nextRequestAt = Date.now() + REQUEST_INTERVAL_MS;
    return request();
  });

  requestQueue = scheduled.catch(() => undefined);
  return scheduled;
};

const fetchNominatim = async (pathname, params) => {
  const url = new URL(pathname, NOMINATIM_BASE_URL);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));

  return scheduleRequest(async () => {
    try {
      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
          "Accept-Language": "en",
          "User-Agent":
            process.env.NOMINATIM_USER_AGENT ||
            `RoomCompanion/1.0 (contact: ${
              process.env.BREVO_SENDER_EMAIL || "roomcompanion-app"
            })`,
        },
        signal: AbortSignal.timeout(8000),
      });

      if (!response.ok) {
        throw new Error(`Nominatim responded with ${response.status}`);
      }

      return response.json();
    } catch (error) {
      throw new AppError(
        "Location service is temporarily unavailable. Please try again.",
        HTTP_STATUS.BAD_GATEWAY
      );
    }
  });
};

const normalizeAddress = (result) => {
  const address = result.address || {};
  const city =
    address.city ||
    address.town ||
    address.village ||
    address.municipality ||
    address.county ||
    "";
  const locality =
    address.suburb ||
    address.neighbourhood ||
    address.city_district ||
    address.quarter ||
    address.road ||
    city;

  return {
    displayAddress: result.display_name || "",
    city,
    locality,
    state: address.state || "",
    country: address.country || "",
    pincode: address.postcode || "",
    latitude: Number(result.lat),
    longitude: Number(result.lon),
  };
};

export const searchLocations = async (query) => {
  const normalizedQuery = query.trim().toLowerCase();
  const cacheKey = `search:${normalizedQuery}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const results = await fetchNominatim("/search", {
    q: query,
    format: "jsonv2",
    addressdetails: "1",
    limit: "5",
    countrycodes: "in",
  });
  const locations = results
    .map(normalizeAddress)
    .filter(
      (location) =>
        location.city &&
        Number.isFinite(location.latitude) &&
        Number.isFinite(location.longitude)
    );
  setCached(cacheKey, locations);
  return locations;
};

export const reverseGeocode = async ({ latitude, longitude }) => {
  const cacheKey = `reverse:${Number(latitude).toFixed(5)}:${Number(longitude).toFixed(5)}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const result = await fetchNominatim("/reverse", {
    lat: latitude,
    lon: longitude,
    format: "jsonv2",
    addressdetails: "1",
    zoom: "18",
  });
  const location = normalizeAddress(result);
  setCached(cacheKey, location);
  return location;
};
