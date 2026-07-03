import axios from "axios";

import { tokenStorage } from "../auth/tokenStorage";
import { env } from "../config/env";

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = tokenStorage.getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message || error.message || "Something went wrong";

    return Promise.reject({
      message,
      status: error.response?.status,
      errors: error.response?.data?.errors || [],
    });
  }
);

