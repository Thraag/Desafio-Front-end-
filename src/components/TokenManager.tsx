import { useEffect } from 'react';
import axios from 'axios';

const TokenManager = () => {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  useEffect(() => {
    const startTokenRefreshTimer = () => {
        console.log('Iniciando temporizador de renovación de token...'); // Agrega esto

      // Renueva el token después de 55 segundos
      const timer = setTimeout(() => {
        refreshAccessToken(refreshToken);
      }, 10000); // 55 segundos

      // Limpiar el temporizador al desmontar el componente
      return () => clearTimeout(timer);
    };

    // Solo inicia el temporizador si hay tokens válidos
    if (accessToken && refreshToken) {
      startTokenRefreshTimer();
    }
  }, [accessToken, refreshToken]); // Dependencias

  const refreshAccessToken = async (refreshToken) => {
    try {
        const response = await axios.post('https://neovc-api-1d2f751d3888.herokuapp.com/users/token/refresh/', {
            token: refreshToken // Solo envía el refresh token
        });
      console.log('Token renovado:', response.data); // Agrega esto para ver la respuesta

      localStorage.setItem('accessToken', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);
    } catch (error) {
      console.error('Error refreshing token', error);
      // Manejar error de refresh token (posiblemente logout o redireccionar)
    }
  };

  return null; // Este componente no necesita renderizar nada
};

export default TokenManager;
