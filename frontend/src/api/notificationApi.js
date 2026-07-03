import { apiClient } from "./apiClient";

export const notificationApi = {
  getNotifications() {
    return apiClient.get("/notifications");
  },
  markRead(id) {
    return apiClient.patch(`/notifications/${id}/read`);
  },
  markAllRead() {
    return apiClient.patch("/notifications/read-all");
  },
};

