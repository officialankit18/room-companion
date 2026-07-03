import { apiClient } from "./apiClient";

export const compatibilityApi = {
  getForListing(listingId) {
    return apiClient.get(`/compatibility/listings/${listingId}`);
  },
};

