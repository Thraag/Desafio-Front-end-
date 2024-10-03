import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface ProfileProps {
  setAuthenticated: (status: boolean) => void; // Propiedad para manejar la autenticación
}

export default function Profile({ setAuthenticated }: ProfileProps) {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    alias: "Usuario123",
    email: "usuario@example.com",
    profilePicture: "https://picsum.photos/150",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [newAlias, setNewAlias] = useState(user.alias);
  const [newProfilePicture, setNewProfilePicture] = useState(user.profilePicture);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      navigate("/login");
    }

    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setUser((prevUser) => ({
        ...prevUser,
        email: storedEmail,
      }));
    }
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        console.error("No refresh token found");
        setAuthenticated(false);
        navigate("/login");
        return;
      }

      const response = await axios.post(
        "https://neovc-api-1d2f751d3888.herokuapp.com/users/logout/",
        { refresh: refreshToken },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response.data);
      if (response.data.message === "Logout successful.") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setAuthenticated(false);
        navigate("/login");
      }
    } catch (error) {
      if (error.response) {
        console.error("Logout error:", error.response.data);
      } else {
        console.error("Error during logout:", error);
      }
    }
  };

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    setUser((prevUser) => ({
      ...prevUser,
      alias: newAlias,
      profilePicture: newProfilePicture,
    }));
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Perfil</h2>
        <div className="flex flex-col items-center justify-center mb-6">
          <label htmlFor="profilePicture" className="block text-gray-700"></label>
          {isEditing ? (
            <>
              <input
                type="text"
                id="profilePicture"
                value={newProfilePicture}
                onChange={(e) => setNewProfilePicture(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                placeholder="URL de la imagen"
              />
              <img
                src={newProfilePicture}
                alt="Profile Preview"
                className="w-32 h-32 rounded-full mt-2 mb-4 object-cover"
              />
            </>
          ) : (
            <img
              src={user.profilePicture}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover"
            />
          )}
        </div>

        <div className="flex flex-col w-full items-center mb-6">
          <div className="mb-4 w-full">
            <label htmlFor="alias" className="text-gray-700">
              Alias
            </label>
            <input
              type="text"
              id="alias"
              value={isEditing ? newAlias : user.alias}
              onChange={isEditing ? (e) => setNewAlias(e.target.value) : undefined}
              readOnly={!isEditing}
              className="mt-1 w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div className="mb-6 w-full">
            <label htmlFor="email" className="text-gray-700">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              value={user.email}
              readOnly
              className="mt-1 w-full border border-gray-300 rounded-md p-2"
            />
          </div>
        </div>

        <button
          onClick={handleEditClick}
          className={`w-full bg-blue-500 text-white py-2 rounded-md mb-2 hover:bg-blue-600 ${
            isEditing ? "hidden" : "block"
          }`}
        >
          Editar Perfil
        </button>

        {isEditing && (
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 flex-1"
            >
              Guardar
            </button>
            <button
              onClick={handleEditClick}
              className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 flex-1"
            >
              Cancelar
            </button>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 mt-4"
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}
