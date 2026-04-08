import { BASE_URL } from "../../environments";
import { decodeResponseData } from "./decoder";

export const refreshAccessToken = async () => {
    try {
        const userStr = localStorage.getItem("user");
        if (!userStr) throw new Error("No user data found");

        const user = JSON.parse(userStr);
        const refreshToken = user.refreshToken;

        if (!refreshToken) throw new Error("No refresh token found");

        const response = await fetch(`${BASE_URL}/refresh-token`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${refreshToken}`,
            },
        });

        const responseData = await response.json();
        const data = decodeResponseData(responseData);

        if (!response.ok) {
            throw new Error(data.message || "Failed to refresh token");
        }

        if (data.success && data.data) {
            const updatedUser = {
                ...user,
                token: data.data.accessToken,
                accessToken: data.data.accessToken,
            };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            window.dispatchEvent(new Event('userLoginStatusChanged'));
            return data.data.accessToken;
        } else {
            throw new Error("Invalid response from refresh endpoint");
        }
    } catch (error) {
        console.error("Token refresh failed:", error);
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("user");
        window.dispatchEvent(new Event('userLoginStatusChanged'));
        throw error;
    }
};
