import { apiClient } from "./apiClient";

export const authApi = {
  register(payload) {
    return apiClient.post("/auth/register", payload);
  },
  verifyEmail(payload) {
    return apiClient.post("/auth/verify-email", payload);
  },
  resendOtp(payload) {
    return apiClient.post("/auth/resend-otp", payload);
  },
  login(payload) {
    return apiClient.post("/auth/login", payload);
  },
  logout() {
    return apiClient.post("/auth/logout");
  },
  me() {
    return apiClient.get("/auth/me");
  },
};

