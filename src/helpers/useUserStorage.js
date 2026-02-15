import { useState, useEffect } from "react";

export function useUserStorage() {
  const [user, setUserState] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  const setUser = (data) => {
    localStorage.setItem("user", JSON.stringify(data));
    localStorage.setItem("isLoggedIn", "true");
    setUserState(data);
  };

  const clearUser = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
    setUserState(null);
  };

  useEffect(() => {
    const listener = () => {
      const saved = localStorage.getItem("user");
      setUserState(saved ? JSON.parse(saved) : null);
    };

    window.addEventListener("storage", listener);
    return () => window.removeEventListener("storage", listener);
  }, []);

  return {
    user,
    isLoggedIn,
    setUser,
    clearUser,
  };
}
