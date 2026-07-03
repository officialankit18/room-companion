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
  createListing(formData) {
    return apiClient.post("/listings", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  updateListing(id, payload) {
    return apiClient.patch(`/listings/${id}`, payload);
  },
  markFilled(id) {
    return apiClient.patch(`/listings/${id}/filled`);
  },
  deleteListing(id) {
    return apiClient.delete(`/listings/${id}`);
  },
};
