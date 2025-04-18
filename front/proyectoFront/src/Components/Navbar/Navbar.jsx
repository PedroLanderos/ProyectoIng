import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { AuthContext } from "../../Context/AuthContext";

const Navbar = () => {
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    if (window.confirm("¿Quieres cerrar sesión?")) {
      logout();
      navigate("/login");
    }
  };

  const handleProfile = () => {
    navigate("/UserProfile");
    setDropdownOpen(false);
  };

  // Cerrar el menú si haces clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
            <div className="user-dropdown-wrapper" ref={dropdownRef}>
              <div
                className="user-icon"
                onClick={() => setDropdownOpen((prev) => !prev)}
                title={`Opciones de ${auth.user.name}`}
              >
                {auth.user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              {dropdownOpen && (
                <div className="user-dropdown">
                  <button onClick={handleProfile}>⚙️ Configuración</button>
                  <button onClick={handleLogout}>🚪 Cerrar sesión</button>
                </div>
              )}
            </div>
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
