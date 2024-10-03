import React, { useEffect, useCallback } from "react";
import axios from "axios";

const TokenManager: React.FC = () => {
  const refreshAccessToken = useCallback(async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      console.error("No refresh token available");
      return;
    }

    try {
      const response = await axios.post(
        "https://neovc-api-1d2f751d3888.herokuapp.com/users/token/refresh/",
        { refresh: refreshToken },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { access, refresh } = response.data;
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);

      console.log("Token refreshed successfully");
      console.log("New access token:", access);


    } catch (error) {
      console.error("Error refreshing token:", error);
      if (axios.isAxiosError(error) && error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        if (error.response.status === 401) {
          console.log(
            "Invalid or expired refresh token. Redirecting to login..."
          );
        }
      }
    }
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log("Attempting to refresh token...");
      refreshAccessToken();
    }, 10000); // Intenta refrescar el token cada 10 segundos

    return () => clearInterval(intervalId);
  }, [refreshAccessToken]);

  return null; // Este componente no renderiza nada visualmente
};

export default TokenManager;
