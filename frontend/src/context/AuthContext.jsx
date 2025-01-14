import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { refreshToken as fetchNewToken } from "../api/api";

const AuthContext = createContext();

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

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  useEffect(() => {
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    } else {
      localStorage.removeItem("refreshToken");
    }
  }, [refreshToken]);

  useEffect(() => {
    // console.log(
    //   "Effect triggered with token:",
    //   token,
    //   "and refreshToken:",
    //   refreshToken
    // );
    const interval = setInterval(async () => {
      if (token && refreshToken) {
        try {
          const data = await fetchNewToken(refreshToken);
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

export const useAuth = () => {
  return useContext(AuthContext);
};
