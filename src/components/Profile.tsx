import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
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
    // Verificar el token de acceso si no hay te redirecciona al login
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      navigate("/login"); // Redirige si no hay token
    }

    // Recuperar el correo electrónico almacenado
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setUser((prevUser) => ({
        ...prevUser,
        email: storedEmail, // Actualizar el estado con el correo almacenado
      }));
    }
  }, [navigate]);

  const handleLogout = () => {
    // Eliminar tokens
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    // Redirigir al login
    navigate("/login");
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
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Perfil</h2>
        <div className="flex flex-col items-center justify-center mb-6">
          <label
            htmlFor="profilePicture"
            className="block text-gray-700"
          ></label>
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
                className="w-32 h-32 rounded-full mt-2 mb-4"
              />
            </>
          ) : (
            <img
              src={user.profilePicture}
              alt="Profile"
              className="w-32 h-32 rounded-full"
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
              onChange={
                isEditing ? (e) => setNewAlias(e.target.value) : undefined
              }
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
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            >
              Guardar
            </button>
            <button
              onClick={handleEditClick}
              className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
            >
              Cancelar
            </button>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="w-full bg-red-700 text-white py-2 rounded-md hover:bg-red-600 mt-4"
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default Profile;
