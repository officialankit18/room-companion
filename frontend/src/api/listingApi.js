import { apiClient } from "./apiClient";

export const listingApi = {
  getListings(params) {
    return apiClient.get("/listings", { params });
  },
  getListing(id) {
    return apiClient.get(`/listings/${id}`);
  },
  getMatchedListings(params) {
    return apiClient.get("/listings/matches", { params });
  },
};

