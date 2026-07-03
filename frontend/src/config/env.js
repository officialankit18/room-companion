const trimTrailingSlash = (value) => value.replace(/\/$/, "");

export const env = {
  apiBaseUrl: trimTrailingSlash(import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1"),
  socketUrl: trimTrailingSlash(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000"),
};
