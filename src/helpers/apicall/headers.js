export const getHeaders = () => {
  const headers = { "Content-Type": "application/json" };

  try {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      const token = user.token || user.accessToken;
      if (token) headers["authorization"] = `Bearer ${token}`;
    }
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
  }

  return headers;
};
