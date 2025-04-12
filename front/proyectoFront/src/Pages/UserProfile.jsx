import React, { useState, useEffect } from 'react';
import './CSS/UserProfile.css';

const mockUser = {
  id: 1,
  name: 'Juan Pérez',
  telephoneNumber: '5512345678',
  adress: 'Av. Instituto Politécnico Nacional 123',
  email: 'juan.perez@correo.com',
  password: '',
  role: 'User',
  dateRegistered: '2024-03-12T14:33:00Z',
};

const UserProfile = () => {
  const [user, setUser] = useState({ ...mockUser });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos actualizados:', user);
    // Aquí puedes hacer una petición PUT/PATCH a tu backend
  };

  return (
    <div className="user-profile">
      <div className="content-wrapper">
        <h2>Mi Perfil</h2>
        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre:</label>
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Teléfono:</label>
            <input
              type="text"
              name="telephoneNumber"
              value={user.telephoneNumber}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Dirección:</label>
            <input
              type="text"
              name="adress"
              value={user.adress}
              onChange={handleChange}
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
            Guardar cambios
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
