import { apiClient } from "./apiClient";

export const conversationApi = {
  getConversations() {
    return apiClient.get("/conversations");
  },
  getMessages(conversationId, params) {
    return apiClient.get(`/conversations/${conversationId}/messages`, { params });
  },
  markRead(conversationId) {
    return apiClient.patch(`/conversations/${conversationId}/read`);
  },
};

