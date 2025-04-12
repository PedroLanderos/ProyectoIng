import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { AuthContext } from "../../Context/AuthContext";

const Navbar = () => {
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("¿Quieres cerrar sesión?")) {
      logout();
      navigate("/login");
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-left">
          <Link to="/MainPage" className="nav-title">
            Buscador de Artículos
          </Link>
        </div>

        <div className="nav-right">
          <Link to="/SearchArticle" className="nav-link">
            Artículos
          </Link>

          {auth.isAuthenticated ? (
            <>
              {auth.user.role === "Admin" && (
                <Link to="/panelAdministrador" className="admin-link">
                  Panel Admin
                </Link>
              )}
              <div
                className="user-icon"
                onClick={handleLogout}
                title={`Cerrar sesión (${auth.user.name})`}
              >
                {auth.user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
            </>
          ) : (
            <Link to="/login" className="login-button">
              Iniciar sesión
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
