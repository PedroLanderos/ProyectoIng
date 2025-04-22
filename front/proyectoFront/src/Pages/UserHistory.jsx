import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { SUGGEST_API } from '../config/apiConfig';
import './CSS/UserHistory.css';

const UserHistory = () => {
  const { id } = useParams();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`${SUGGEST_API}/UserData/history/${id}`);
      setHistory(response.data);
    } catch (err) {
      console.error("❌ Error al obtener historial:", err);
      setError("No se pudo cargar el historial del usuario.");
    }
    setLoading(false);
  };

  const handleDelete = async (activityId) => {
    const confirm = window.confirm("¿Estás seguro de eliminar esta actividad?");
    if (!confirm) return;

    try {
      await axios.delete(`${SUGGEST_API}/UserData/history/${activityId}`);
      setMessage("✅ Actividad eliminada correctamente.");
      fetchHistory(); // recargar historial
    } catch (err) {
      console.error("❌ Error al eliminar actividad:", err);
      setMessage("❌ No se pudo eliminar la actividad.");
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [id]);

  return (
    <div className="user-history-page">
      <div className="history-wrapper">
        <h1>Historial de Usuario (ID: {id})</h1>
        {loading && <p>Cargando historial...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {message && <p style={{ color: message.includes("❌") ? "red" : "green" }}>{message}</p>}
        {!loading && history.length === 0 && <p>No hay historial para este usuario.</p>}

        {history.length > 0 && (
          <table className="history-table">
            <thead>
              <tr>
                <th>ID Actividad</th>
                <th>Artículo ID</th>
                <th>¿Favorito?</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>
                    <a
                      href={`/ArticleDetail/${item.articleId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#0077cc', textDecoration: 'underline' }}
                    >
                      {item.articleId}
                    </a>
                  </td>
                  <td>{item.isFavorite ? "⭐ Sí" : "No"}</td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(item.id)}
                    >
                      🗑️ Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UserHistory;
