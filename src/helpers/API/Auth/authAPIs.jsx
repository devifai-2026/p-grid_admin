import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStorage } from "../../useUserStorage";
import { apiCall } from "../../apicall/apiCall";
import { onError } from "../../converters/onError";
import { formatUser } from "../../converters/user";
import { showSuccess, showError } from "../../swalHelper";


const base = "auth";

export const useAuthApi = () => {
  const navigate = useNavigate();
  const { setUser, clearUser } = useUserStorage();

  const [loading, setLoading] = useState(false);

  const login = useCallback(
    async ({ email, password }) => {
      apiCall.post({
        route: `${base}/login`,
        payload: { email, password },
        onSuccess: (response) => {
          const userData = formatUser(response.data);
          setUser(userData);
          window.dispatchEvent(new Event("userLoginStatusChanged"));
          showSuccess("Login successful! Welcome back.");
          navigate("/");
        },
        onError: () => showError("Invalid Name or Email!"),
        setLoading,
      });
    },
    [navigate, setUser],
  );

  const logout = useCallback(
    (onLogout) => {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const refreshToken = user.refreshToken;

      apiCall.post({
        route: `logout`,
        headers: refreshToken
          ? { authorization: `Bearer ${refreshToken}` }
          : {},
        onSuccess: () => {
          clearUser();
          if (onLogout) onLogout();
          window.dispatchEvent(new Event("userLoginStatusChanged"));
          showSuccess("Logged out successfully");
          navigate("/login");
        },
        onError: (err) => {
          console.error("Logout failed:", err);
          // Even if API fails, we should clear local storage for security
          clearUser();
          if (onLogout) onLogout();
          navigate("/login");
        },
        setLoading,
      });
    },
    [navigate, clearUser],
  );

  const signup = (formData, onSuccess) => {
    apiCall.post({
      route: `${base}/signup`,
      payload: {
        username: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
      },
      onSuccess: () => {
        if (onSuccess) onSuccess();
      },
      onError,
    });
  };

  return {
    login,
    logout,
    signup,
    loading,
  };
};
