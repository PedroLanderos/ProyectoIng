import React, { useState, useEffect, useContext } from 'react';
import './CSS/UserProfile.css';
import { AuthContext } from '../Context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config/apiConfig';

const UserProfile = () => {
  const { auth, checkSession } = useContext(AuthContext);
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/authentication/${auth.user.id}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      });
      setUser(response.data);
    } catch (error) {
      console.error("❌ Error al obtener datos del perfil:", error);
    }
  };

  useEffect(() => {
    checkSession();
    if (auth?.user?.id) {
      fetchUserData();
    }
  }, [auth]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${API_BASE_URL}/authentication`, user, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200 || response.status === 201) {
        setMessage("✅ Datos actualizados correctamente.");
      }
    } catch (error) {
      console.error("❌ Error al actualizar el perfil:", error);
      setMessage("❌ Error al guardar cambios.");
    }
  };

  const handleViewHistory = () => {
    navigate(`/UserHistory/${auth.user.id}`);
  };

  if (!user) return <div className="user-profile">Cargando perfil...</div>;

  return (
    <div className="user-profile">
      <div className="content-wrapper">
        <h2>Mi Perfil</h2>
        {message && <p style={{ textAlign: 'center', color: message.includes("✅") ? "green" : "red" }}>{message}</p>}
        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre:</label>
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Teléfono:</label>
            <input
              type="text"
              name="telephoneNumber"
              value={user.telephoneNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Dirección:</label>
            <input
              type="text"
              name="address"
              value={user.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Correo electrónico:</label>
            <input type="email" value={user.email} disabled />
          </div>

          <div className="form-group">
            <label>Rol:</label>
            <input type="text" value={user.role} disabled />
          </div>

          <div className="form-group">
            <label>Fecha de registro:</label>
            <input
              type="text"
              value={new Date(user.dateRegistered).toLocaleDateString()}
              disabled
            />
          </div>

          <button type="submit" className="save-button">
            💾 Guardar cambios
          </button>

          <button
            type="button"
            className="history-button"
            onClick={handleViewHistory}
            style={{
              marginLeft: '1rem',
              backgroundColor: '#0071c2',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            📜 Ver historial
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
