import { createContext, useContext, useEffect, useMemo, useState } from "react";
// import { loginUser } from "../api/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken_] = useState(localStorage.getItem("token"));

  const setToken = (newToken) => {
    // Comment out the call to loginUser
    // try {
    //   const data = await loginUser(credentials);
    //   const newToken = data.access;
    setToken_(newToken);
    // } catch (error) {
    //   console.error("Failed to log in:", error);
    // }
  };

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  const contextValue = useMemo(
    () => ({
      token,
      setToken,
    }),
    [token]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
