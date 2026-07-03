import { apiClient } from "./apiClient";

export const tenantProfileApi = {
  getProfile() {
    return apiClient.get("/tenant-profile/me");
  },
  saveProfile(payload) {
    return apiClient.put("/tenant-profile/me", payload);
  },
};

