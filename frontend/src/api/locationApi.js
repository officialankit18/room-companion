import { apiClient } from "./apiClient";

export const locationApi = {
  search(query) {
    return apiClient.get("/locations/search", { params: { q: query } });
  },
  reverse(latitude, longitude) {
    return apiClient.get("/locations/reverse", {
      params: { latitude, longitude },
    });
  },
};
