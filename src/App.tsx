// App.tsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import RequestOTP from './components/RequestOTP'; // Asegúrate de tener la ruta correcta
import Profile from './components/Profile'; // También para el perfil, si ya lo tienes
import Login from './components/Login'; // Importa el componente Login
import TokenManager from './components/TokenManager'; // Importa el TokenManager

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado para controlar la autenticación

  // Función para manejar la autenticación
  const handleAuthentication = (status) => {
    setIsAuthenticated(status); // Cambia el estado de autenticación
  };

  return (
    <Router>
      {isAuthenticated && <TokenManager />} {/* Monta TokenManager solo si estás autenticado */}
      <Routes>
        <Route path="/" element={<RequestOTP />} /> {/* Mostrar el componente de solicitar OTP */}
        <Route path="/login" element={<Login setAuthenticated={handleAuthentication} />} /> {/* Pasar función a Login */}
        <Route path="/profile" element={<Profile />} /> {/* Mostrar el perfil después de autenticarse */}
      </Routes>
    </Router>
  );
}

export default App;
