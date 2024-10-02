import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
  setAuthenticated: (status: boolean) => void; // recibira un booleano, void es que no devolvera un valor.
}

const Login: React.FC<LoginProps> = ({ setAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Al montar el componente, se establece el email del local storage en el input email
  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  // Maneja el inicio de sesión
  const handleLogin = async () => {
    try {
      const response = await axios.post('https://neovc-api-1d2f751d3888.herokuapp.com/users/login/', {
        email,
        token,
      });

      // Guardar tokens en localStorage
      localStorage.setItem('accessToken', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);

      // Cambiar estado de autenticación
      setAuthenticated(true); // Llama a setAuthenticated para indicar que el usuario ha iniciado sesión

      // Redireccionar al perfil
      navigate('/profile');
    } catch (error) {
      // Manejo de error mejorado
      if (axios.isAxiosError(error)) {
        // Verifica si es un error de Axios
        if (error.response) {
          // La solicitud se realizó y el servidor respondió con un código de estado que cae fuera del rango de 2xx
          console.error("Error en la respuesta del servidor:", error.response.data);
          setError(`Error: ${error.response.data.message || 'Ocurrió un error desconocido.'}`);
        } else if (error.request) {
          // La solicitud se realizó pero no se recibió respuesta
          console.error("Error en la solicitud:", error.request);
          setError('Error: No se recibió respuesta del servidor.');
        } else {
          // Algo sucedió al configurar la solicitud que lanzó un error
          console.error("Error:", error.message);
          setError(`Error: ${error.message}`);
        }
      } else {
        // No es un error de Axios
        console.error("Error inesperado:", error);
        setError('Error inesperado. Inténtalo de nuevo.');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Iniciar Sesión</h2>

        <div className="mb-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <button
          onClick={handleLogin}
          className="w-full p-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
        >
          Iniciar Sesión
        </button>
      </div>
    </div>
  );
};

export default Login;
