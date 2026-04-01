import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial check
    const syncUser = () => {
      const userStr = localStorage.getItem("user");
      const loggedInStr = localStorage.getItem("isLoggedIn");

      if (userStr && loggedInStr === "true") {
        try {
          setUserState(JSON.parse(userStr));
          setIsLoggedIn(true);
        } catch (e) {
          console.error("Failed to parse user data", e);
          localStorage.removeItem("user");
          localStorage.removeItem("isLoggedIn");
          setUserState(null);
          setIsLoggedIn(false);
        }
      } else {
        setUserState(null);
        setIsLoggedIn(false);
      }
      setLoading(false);
    };

    syncUser();

    window.addEventListener("userLoginStatusChanged", syncUser);
    return () => window.removeEventListener("userLoginStatusChanged", syncUser);
  }, []);

  const login = (userData) => {
    const userWithRole = {
      ...userData,
      role: userData.role || (Array.isArray(userData.roles) ? userData.roles[0] : null),
    };
    localStorage.setItem("user", JSON.stringify(userWithRole));
    localStorage.setItem("isLoggedIn", "true");
    setUserState(userWithRole);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
    setUserState(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
