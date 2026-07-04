const trimTrailingSlash = (value) => value.replace(/\/$/, "");

export const env = {
  apiBaseUrl: trimTrailingSlash(
    import.meta.env.VITE_API_BASE_URL ||
      "https://dimgrey-herring-526627.hostingersite.com/api/v1"
  ),
  socketUrl: trimTrailingSlash(
    import.meta.env.VITE_SOCKET_URL || "https://dimgrey-herring-526627.hostingersite.com"
  ),
};
