import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { publicAxios } from "../api/api";

const AuthContext = createContext();

/**
 * AuthProvider component provides authentication context to its children.
 * It manages the authentication tokens and refreshes them periodically.
 */
export const AuthProvider = ({ children }) => {
  const [token, setToken_] = useState(localStorage.getItem("token"));
  const [refreshToken, setRefreshToken_] = useState(
    localStorage.getItem("refreshToken")
  );

  const setToken = (newToken) => {
    setToken_(newToken);
  };

  const setRefreshToken = (newRefreshToken) => {
    setRefreshToken_(newRefreshToken);
  };

  // Store token in localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  // Store refresh token in localStorage
  useEffect(() => {
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    } else {
      localStorage.removeItem("refreshToken");
    }
  }, [refreshToken]);

  // Refresh token periodically
  useEffect(() => {
    const interval = setInterval(async () => {
      if (token && refreshToken) {
        try {
          const response = await publicAxios.post("token/refresh/", {
            refresh: refreshToken,
          });
          const data = response.data;
          setToken(data.access);
          setRefreshToken(data.refresh);
          console.log("Token has been refreshed successfully.");
        } catch (error) {
          console.error("Failed to refresh token:", error);
        }
      }
    }, 240000);

    return () => clearInterval(interval);
  }, [token, refreshToken, setToken, setRefreshToken]);

  const contextValue = useMemo(
    () => ({
      token,
      setToken,
      refreshToken,
      setRefreshToken,
    }),
    [token, refreshToken]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

/**
 * Custom hook to use the AuthContext.
 * @returns {Object} - The authentication context value.
 */
export const useAuth = () => {
  return useContext(AuthContext);
};
