import React, { useState, useEffect } from "react"; 
import axios from "axios"; // Importamos axios para hacer solicitudes HTTP al servido
import { useNavigate } from "react-router-dom"; 

interface LoginProps {
  setAuthenticated: (status: boolean) => void; //void => no retorna nada . rompemos la regla normal de padre a hijo usamos una funcion
  // asi notifica al componente padre de algo (esto es nuevo, en este caso activar el refreshtoken una vez es autenticado)
}

const Login: React.FC<LoginProps> = ({ setAuthenticated }) => {
  const [email, setEmail] = useState(""); 
  const [token, setToken] = useState("");
  const [error, setError] = useState(""); 
  const navigate = useNavigate(); // Inicializamos el hook para navegación

  // Al montar el componente, buscamos el email almacenado en localStorage y lo establecemos en el input para pra precargarlo
  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail"); // Recuperamos el email guardado
    if (storedEmail) {
      setEmail(storedEmail); // Si hay un email, lo ponemos en el estado para que inicie precargado
    }
  }, []); // Este efecto solo se ejecuta una vez cuando se monta el componente, tambien evitamos el loop infinito

  //funcion del login
  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "https://neovc-api-1d2f751d3888.herokuapp.com/users/login/",
        {
          email, // Enviamos el correo electrónico
          token, // Enviamos el token
        }
      );

      // Guardamos los tokens recibidos en localStorage
      localStorage.setItem("accessToken", response.data.access); 
      localStorage.setItem("refreshToken", response.data.refresh); 
      console.log("Access Token:", response.data.access); // Imprimimos el token de acceso en la consola para verlos
      console.log("Refresh Token:", response.data.refresh); // Imprimimos el token de refresco en la consola para verlo
      setAuthenticated(true); // Actualizamos el estado de autenticación a verdadero para que inicie en el app el token refresher

      // Redireccionamos al perfil del usuario para seguir con la siguiente etapa
      navigate("/profile");

    } catch (error) {
      if (axios.isAxiosError(error)) { 
        if (error.response) { 
          console.error(
            "Error en la respuesta del servidor:",
            error.response.data 
          );
          setError(
            `Error: ${
              error.response.data.message || "Ocurrió un error desconocido."
            }`
          );
        } else if (error.request) { // Si la solicitud se hizo pero no se recibió respuesta
          console.error("Error en la solicitud:", error.request); 
          setError("Error: No se recibió respuesta del servidor."); 
        } else { 
          console.error("Error:", error.message); 
          setError(`Error: ${error.message}`); 
        }
      } else {
        // Si el error no es de Axios
        console.error("Error inesperado:", error); // Imprimimos el error en la consola
        setError("Error inesperado. Inténtalo de nuevo."); // Mensaje de error al usuario
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100"> 
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"> 
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Iniciar Sesión
        </h2>

        <div className="mb-4">
          <input
            type="email" // Tipo de entrada para el email
            placeholder="Email" // Texto de marcador en el input
            value={email} // Valor controlado por el estado email
            onChange={(e) => setEmail(e.target.value)} // Actualiza el estado email al escribir
            required // El campo es obligatorio
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" // Clases de estilo
          />
        </div>

        <div className="mb-4">
          <input
            type="text" 
            placeholder="Token"
            value={token} 
            onChange={(e) => setToken(e.target.value)} 
            required 
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" // Clases de estilo
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
