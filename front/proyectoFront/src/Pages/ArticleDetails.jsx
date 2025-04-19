import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './CSS/ArticleDetails.css';
import { ARTICLES_API, SUGGEST_API } from '../config/apiConfig';
import { AuthContext } from '../Context/AuthContext';

const ArticleDetails = () => {
  const { id } = useParams();
  const { auth } = useContext(AuthContext);
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = async () => {
    if (!auth.isAuthenticated) return;

    try {
      const response = await axios.get(`${SUGGEST_API}/UserData/history/${auth.user.id}`);
      const existing = response.data.find(a => a.articleId === id);

      if (existing) {
        await axios.put(`${SUGGEST_API}/UserData/history/${existing.id}`, {
          ...existing,
          isFavorite: !isFavorite
        });
      } else {
        await axios.post(`${SUGGEST_API}/UserData/history`, {
          userId: auth.user.id,
          articleId: id,
          isFavorite: true
        });
      }

      setIsFavorite(prev => !prev);
    } catch (error) {
      console.error("❌ Error al actualizar favorito:", error);
    }
  };

  const saveVisitToHistory = async () => {
    if (!auth.isAuthenticated) return;

    try {
      const payload = {
        userId: auth.user.id,
        articleId: id,
        isFavorite: false,
      };

      await axios.post(`${SUGGEST_API}/UserData/history`, payload, {
        headers: { 'Content-Type': 'application/json' }
      });

      console.log("📝 Artículo registrado en historial.");
    } catch (error) {
      console.error("❌ Error al guardar historial:", error);
    }
  };

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(`${ARTICLES_API}/article/${id}`);
        setArticle(response.data);

        if (auth.isAuthenticated) {
          saveVisitToHistory();
        }
      } catch (error) {
        console.error("❌ Error al cargar artículo:", error);
        if (error.response?.status === 404) {
          setArticle(null);
        } else if (error.response?.status === 429) {
          alert("⚠️ Has alcanzado el límite de peticiones. Intenta más tarde.");
        } else {
          alert("❌ No se pudo cargar el artículo.");
        }
      }
      setLoading(false);
    };

    fetchArticle();
  }, [id, auth.isAuthenticated]);

  useEffect(() => {
    const checkIfFavorite = async () => {
      if (!auth.isAuthenticated) return;

      try {
        const res = await axios.get(`${SUGGEST_API}/UserData/favorites/${auth.user.id}/check/${id}`);
        setIsFavorite(res.data === true);
      } catch (error) {
        console.error("❌ Error al verificar favorito:", error);
      }
    };

    checkIfFavorite();
  }, [id, auth.isAuthenticated]);

  if (loading) return <p>🔄 Cargando artículo...</p>;
  if (!article) return <p>❌ Artículo no encontrado.</p>;

  return (
    <div className="article-details">
      <div className="content-wrapper">
        <div className="header-with-favorite">
          <h1>{article.title}</h1>
          {auth.isAuthenticated && (
            <span
              className={`favorite-icon ${isFavorite ? 'active' : ''}`}
              title={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
              onClick={toggleFavorite}
            >
              ★
            </span>
          )}
        </div>

        <p className="subtitle">{article.journal} — {article.yearPublished}</p>

        <div className="meta-info">
          <p><strong>Publicado:</strong> {new Date(article.publishedDate).toLocaleDateString()}</p>
          <p><strong>Autores:</strong> {article.authors.map(a => a.name).join(', ')}</p>
          <p><strong>Temas:</strong> {article.subjects.join(', ')}</p>
        </div>

        <div className="section">
          <h3>Resumen</h3>
          <p>{article.abstract}</p>
        </div>

        {article.fullText && (
          <div className="section">
            <h3>Texto completo</h3>
            <p>{article.fullText}</p>
          </div>
        )}

        <div className="section">
          <h3>Enlaces</h3>
          <ul>
            {article.downloadUrl && (
              <li>
                <a href={article.downloadUrl} target="_blank" rel="noopener noreferrer">
                  Descargar PDF
                </a>
              </li>
            )}
            {article.links?.map((link, index) => (
              <li key={index}>
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  Fuente adicional {index + 1}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetails;
