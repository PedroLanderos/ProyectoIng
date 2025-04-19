import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    token: null,
    user: null,
  });

  // 🔁 Verifica la sesión guardada en sessionStorage
  const checkSession = () => {
    const token = sessionStorage.getItem("token");
    const user = JSON.parse(sessionStorage.getItem("user"));

    if (token && user) {
      setAuth({
        isAuthenticated: true,
        token,
        user,
      });
    } else {
      setAuth({ isAuthenticated: false, token: null, user: null });
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  // 🔐 Login y decodificación del token
  const login = (token) => {
    if (!token || typeof token !== "string") {
      console.error("Token inválido al intentar decodificar:", token);
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      console.log("🔍 Token decodificado:", decodedToken);

      // 🧠 Decodifica el usuario
      const user = {
        id: decodedToken.UserId ? parseInt(decodedToken.UserId, 10) : null,
        name:
          decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ||
          decodedToken.name ||
          "Usuario",
        email:
          decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] ||
          decodedToken.email ||
          "Sin correo",
        role:
          decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
          decodedToken.role ||
          "Normal",
      };

      // 💾 Guardar en sesión
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("user", JSON.stringify(user));

      setAuth({
        isAuthenticated: true,
        token,
        user,
      });

      console.log("✅ Usuario autenticado correctamente:", user);
    } catch (error) {
      console.error("❌ Error al decodificar el token:", error);
      logout();
    }
  };

  // 🔓 Logout
  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    setAuth({ isAuthenticated: false, token: null, user: null });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, checkSession }}>
      {children}
    </AuthContext.Provider>
  );
};
