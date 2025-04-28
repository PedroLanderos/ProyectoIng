import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { AuthContext } from "../../Context/AuthContext";

const Navbar = () => {
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [imageError, setImageError] = useState(false);
  const [ theme, setTheme] = useState(() => {
    let t = localStorage.getItem("theme");
    return (localStorage.getItem("theme") != undefined)?t:'light';
  });

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

  const handleViewHistory = () => {
    navigate(`/UserHistory/${auth.user.id}`);
    setDropdownOpen(false);
  };

  const imageUrl = auth?.user?.id
    ? `http://localhost:5006/user_profiles/user_${auth.user.id}.png`
    : null;

  useEffect(() => {
    if(theme == 'dark') document.body.classList.add('dark');

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
            SciFind
          </Link>
        </div>

        <div className="nav-right">
          <img src = {theme == 'light'?"/darkThemeIcon.svg":"/lightThemeIcon.svg"}
               width="40" height="40"
               alt = "Cambiar tema (light/dark)"
               onClick = {() => {
                let newTheme = theme == 'light'?'dark':'light';
                localStorage.setItem("theme", newTheme);
                document.body.classList.toggle("dark");
                setTheme(newTheme);
               }}
          />

          <Link to="/SearchArticle" className="nav-link">
            Artículos
          </Link>

          {auth.isAuthenticated ? (
            <>
              {auth.user && auth.user.role === "Admin" && (
                <Link to="/panelAdministrador" className="admin-link">
                  Panel Admin
                </Link>
              )}

              <div className="user-dropdown-wrapper" ref={dropdownRef}>
                <div
                  className="user-icon"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  title={`Opciones de ${auth.user.name}`}
                >
                  {imageUrl && !imageError ? (
                    <img
                      src={imageUrl}
                      alt="Perfil"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    auth.user?.name?.charAt(0).toUpperCase() || "U"
                  )}
                </div>

                {dropdownOpen && (
                  <div className="user-dropdown">
                    <button onClick={handleProfile}>⚙️ Configuración</button>
                    <button onClick={handleViewHistory}>📜 Ver historial</button>
                    <button onClick={handleLogout}>🚪 Cerrar sesión</button>
                  </div>
                )}
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
