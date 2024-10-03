import { useState } from "react"; // estados para manejar la app
import axios from "axios"; // importamos axios para la solicitud al servidor
import { useNavigate } from "react-router-dom"; // navigate para redireccinar entre pages

// necesitamos 2 estados, el email, el mensaje y un navigate de react router para redireccionar
function RequestOTP() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // get y post se manejan mejor con operacion asincronas
  const handleRequestOTP = async () => {
    // email es un string vacio, asi que es falsy, lo invertimos para que cuando sea un string vacio, de true y muestre el mensaje
    // si email es false , muestrame un true
    if (!email) {
      setMessage("Por favor, ingresa tu correo.");
      return;
    }
    // await es para esperar la promesa de la  data este completa, llega y sigue el codigo, solo funciona con funciones async (asincronas)
    // axios.post(url, data A enviar, config); esa es la sintaxis
    // post se utiliza para enviar datos al servidor, la otp es la respuesta, pueden ser varias, estados http , confirmaciones etc
    try {
      await axios.post(
        "https://neovc-api-1d2f751d3888.herokuapp.com/users/get-otp/",
        { email }
      );
      // si no tomo el catch error , la solicitud a sido exitosa.
      // localstore se guarda en el navegador, a diferencia del sessionstore persiste mas
      // localstore es un objeto que permite guardar informacion de la session en el navegador incluso si se cierra
      // funciona con clave valor. userEmail es la clave y email es la variable que sera identificada por la clave
      localStorage.setItem("userEmail", email);

      //navigate despues de guardar el local, nos redirecciona al login
      navigate("/login");
    } catch (error) {
      console.error(error);
      setMessage("Error al enviar OTP.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Solicitar OTP
        </h2>

        <input
          type="email"
          placeholder="Ingresa tu correo"
          value={email} // componente controlado por este estado, email siempre se actualizara. COMPONENTE CONTROLADO
          // escuchador de eventos sencillo inline, on-change para setear el email cuando se tipea
          onChange={(e) => setEmail(e.target.value)} // llamando directamente al set email en vez de crear una setvariable
          className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <button
          // eventos de click para enviar el post a la api
          onClick={handleRequestOTP}
          className="w-full p-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
        >
          Solicitar OTP
        </button>
        {/* Operador and para mostrar mensaje, o no mostrar nada si no se cumple */}
        {message && (
          <p className="text-sm text-gray-600 mt-4 text-center">{message}</p>
        )}
      </div>
    </div>
  );
}

export default RequestOTP;
