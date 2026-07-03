import { apiClient } from "./apiClient";

export const adminApi = {
  getActivity() {
    return apiClient.get("/admin/activity");
  },
  getUsers(params) {
    return apiClient.get("/admin/users", { params });
  },
  updateUserStatus(id, isActive) {
    return apiClient.patch(`/admin/users/${id}/status`, { isActive });
  },
  getListings(params) {
    return apiClient.get("/admin/listings", { params });
  },
  updateListingStatus(id, status) {
    return apiClient.patch(`/admin/listings/${id}/status`, { status });
  },
};

