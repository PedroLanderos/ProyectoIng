import React, { useState, useContext } from "react";
import "./CSS/LoginSignup.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import API_BASE_URL from "../config/apiConfig";

const LoginSignup = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    Id: 0,
    name: "",
    TelephoneNumber: "",
    Address: "",
    email: "",
    password: "",
    role: "Normal",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isRegister
      ? `${API_BASE_URL}/Authentication/Register`
      : `${API_BASE_URL}/Authentication/Login`;

    try {
      const response = await axios.post(endpoint, formData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (response.status === 200) {
        if (isRegister) {
          setMessage("✅ Usuario registrado exitosamente.");
          setIsRegister(false);
        } else {
          const token = response.data.message;
          if (!token || typeof token !== "string") throw new Error("Token inválido o ausente.");

          setMessage("✅ Login exitoso!");
          login(token);
          navigate("/MainPage"); // 🔄 Redirigir al home
        }
      }
    } catch (error) {
      console.error("❌ Error en handleSubmit:", error.response ? error.response.data : error);
      setMessage(
        isRegister ? "❌ Error al registrar usuario. Verifica los datos." : "❌ Error al iniciar sesión. Verifica los datos."
      );
    }
  };

  return (
    <div className="loginSignup">
      <div className="loginSignup-container">
        <h1>{isRegister ? "Registro" : "Iniciar Sesión"}</h1>
        {message && <p className={message.includes("Error") ? "error-message" : "success-message"}>{message}</p>}

        <form onSubmit={handleSubmit} className="loginSignup-fields">
          {isRegister && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Nombre Completo"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type="tel"
                name="TelephoneNumber"
                placeholder="Número de Teléfono"
                value={formData.TelephoneNumber}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="Address"
                placeholder="Dirección"
                value={formData.Address}
                onChange={handleChange}
                required
              />
            </>
          )}
          <input
            type="email"
            name="email"
            placeholder="Correo Electrónico"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit">{isRegister ? "Registrar" : "Iniciar Sesión"}</button>
        </form>

        <div className="loginSignup-toggle">
          {isRegister ? (
            <>
              ¿Ya tienes una cuenta?{" "}
              <span onClick={() => setIsRegister(false)}>Inicia Sesión</span>
            </>
          ) : (
            <>
              ¿No tienes una cuenta?{" "}
              <span onClick={() => setIsRegister(true)}>Regístrate</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
