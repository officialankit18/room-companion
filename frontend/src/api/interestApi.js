import { apiClient } from "./apiClient";

export const interestApi = {
  sendInterest(listingId) {
    return apiClient.post(`/interests/listings/${listingId}`);
  },
  getTenantInterests() {
    return apiClient.get("/interests/tenant");
  },
  getOwnerInterests() {
    return apiClient.get("/interests/owner");
  },
  acceptInterest(id) {
    return apiClient.patch(`/interests/${id}/accept`);
  },
  declineInterest(id) {
    return apiClient.patch(`/interests/${id}/decline`);
  },
};

