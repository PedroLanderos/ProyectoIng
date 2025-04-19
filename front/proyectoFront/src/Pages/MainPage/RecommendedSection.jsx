import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';
import axios from 'axios';
import { SUGGEST_API } from '../../config/apiConfig';
import '../CSS/MainPage/RecommendedSection.css';

const RecommendedSection = () => {
  const { auth } = useContext(AuthContext);
  const isAuthenticated = auth?.isAuthenticated;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [recommendedArticles, setRecommendedArticles] = useState([]);
  const [hasRecommendations, setHasRecommendations] = useState(true);

  const fetchRecommendations = async () => {
    try {
      const response = await axios.get(`${SUGGEST_API}/UserData/recommendations/${auth.user.id}`);
      setRecommendedArticles(response.data);
      setHasRecommendations(response.data && response.data.length > 0);
    } catch (error) {
      console.warn("⚠️ No se pudieron obtener recomendaciones:", error);
      setHasRecommendations(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchRecommendations();
    }
  }, [isAuthenticated]);

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  const handleExplore = () => {
    navigate('/SearchArticle');
  };

  const handleArticleClick = (id) => {
    navigate(`/ArticleDetail/${id}`);
  };

  return (
    <div className="section-block recommended-section">
      <div className="content-wrapper">
        <h2>Artículos recomendados para ti</h2>

        {!isAuthenticated ? (
          <>
            <p>Inicia sesión para recibir recomendaciones personalizadas.</p>
            <button className="search-button" onClick={handleLoginRedirect}>
              Iniciar sesión
            </button>
          </>
        ) : loading ? (
          <p>Cargando recomendaciones...</p>
        ) : !hasRecommendations ? (
          <>
            <p>
              Aún no tenemos suficientes datos sobre tus intereses.
              Explora más artículos para obtener recomendaciones.
            </p>
            <button className="search-button" onClick={handleExplore}>
              Explorar artículos
            </button>
          </>
        ) : (
          <div className="recommended-articles">
            {recommendedArticles.map((art, idx) => (
              <div
                key={idx}
                className="recommended-article"
                onClick={() => handleArticleClick(art.id)}
              >
                <a href="#" onClick={(e) => e.preventDefault()}>
                  {art.title || 'Artículo sin título'}
                </a>
                <p>{art.journal || 'Fuente desconocida'} – {art.yearPublished || 'Año desconocido'}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendedSection;
