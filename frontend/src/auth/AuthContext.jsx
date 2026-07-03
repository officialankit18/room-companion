import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import { authApi } from "../api/authApi";
import { tokenStorage } from "./tokenStorage";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => tokenStorage.getToken());
  const [isBootstrapping, setIsBootstrapping] = useState(Boolean(tokenStorage.getToken()));

  const clearSession = useCallback(() => {
    tokenStorage.clearToken();
    setToken(null);
    setUser(null);
  }, []);

  const refreshCurrentUser = useCallback(async () => {
    const response = await authApi.me();
    setUser(response.data.user);
    return response.data.user;
  }, []);

  useEffect(() => {
    let isMounted = true;

    const bootstrap = async () => {
      if (!tokenStorage.getToken()) {
        setIsBootstrapping(false);
        return;
      }

      try {
        const response = await authApi.me();
        if (isMounted) {
          setUser(response.data.user);
        }
      } catch (error) {
        if (isMounted) {
          clearSession();
        }
      } finally {
        if (isMounted) {
          setIsBootstrapping(false);
        }
      }
    };

    bootstrap();

    return () => {
      isMounted = false;
    };
  }, [clearSession]);

  const login = useCallback(async (payload) => {
    const response = await authApi.login(payload);
    const authToken = response.data.token;

    tokenStorage.setToken(authToken);
    setToken(authToken);
    setUser(response.data.user);
    toast.success("Logged in successfully");

    return response.data.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      if (tokenStorage.getToken()) {
        await authApi.logout();
      }
    } catch (error) {
      // Frontend logout should still complete if the server is unreachable.
    } finally {
      clearSession();
      toast.success("Logged out");
    }
  }, [clearSession]);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user && token),
      isBootstrapping,
      login,
      logout,
      refreshCurrentUser,
      setUser,
    }),
    [isBootstrapping, login, logout, refreshCurrentUser, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

