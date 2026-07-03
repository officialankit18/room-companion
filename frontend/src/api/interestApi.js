import { apiClient } from "./apiClient";

export const interestApi = {
  sendInterest(listingId) {
    return apiClient.post(`/interests/listings/${listingId}`);
  },
  getTenantInterests() {
    return apiClient.get("/interests/tenant");
  },
};

