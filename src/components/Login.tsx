import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // apenas el componente se monta seteamos el email del local storage en el input email
  useEffect(() => {
    // llamo el item por su llave y lo guardo en variable
    const storedEmail = localStorage.getItem('userEmail');
    // si tengo el item setea email como la variable anterior para que inicie la pagina con el mail
    if (storedEmail) {
      setEmail(storedEmail); 
    }
  }, []);

  // se envia una solicitud post con axios, con la misma sintaxis, url y variables que deben ser email y token
  // para ingresar
  const handleLogin = async () => {
    try {
      const response = await axios.post('https://neovc-api-1d2f751d3888.herokuapp.com/users/login/', {
        email,
        token
      });
      // fundamental guardar el acceso  token para mantenernos logeados
      localStorage.setItem('accessToken', response.data.access);
      // refresh token para usar todo el tiempo posible
      localStorage.setItem('refreshToken', response.data.refresh);
      // redireccionar al perfil
      navigate('/profile');
    } catch (error) {
      console.error(error.response ? error.response.data : error);
      setError('Error al iniciar sesión. Verifica tus credenciales.');
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
            onChange={(e) => setEmail(e.target.value)} // Permite editar el email
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Token"
            value={token}
            onChange={(e) => setToken(e.target.value)} // El token sigue vacío por defecto
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
