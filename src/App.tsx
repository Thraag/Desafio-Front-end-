// App.tsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RequestOTP from './components/RequestOTP'; // Asegúrate de tener la ruta correcta
import Profile from './components/Profile'; // También para el perfil, si ya lo tienes
import Login from './components/Login'; // Importa el componente Login

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RequestOTP />} /> {/* Mostrar el componente de solicitar OTP */}
        <Route path="/login" element={<Login />} /> {/* Mostrar el componente de inicio de sesión */}
        <Route path="/profile" element={<Profile />} /> {/* Mostrar el perfil después de autenticarse */}
      </Routes>
    </Router>
  );
}

export default App;
