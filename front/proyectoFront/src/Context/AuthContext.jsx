import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    token: null,
    user: null,
  });

  // ✅ Verifica si hay sesión persistida
  const checkSession = () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

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

  const login = (token) => {
    if (!token || typeof token !== "string") {
      console.error("Token inválido al intentar decodificar:", token);
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      console.log("🔍 Token decodificado:", decodedToken);

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

      // 💾 Guardar en localStorage para persistencia entre pestañas
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

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

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuth({ isAuthenticated: false, token: null, user: null });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, checkSession }}>
      {children}
    </AuthContext.Provider>
  );
};
