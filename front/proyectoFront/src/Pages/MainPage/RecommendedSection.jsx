import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';
import axios from 'axios';
import { SUGGEST_API } from '../../config/apiConfig';
import '../CSS/MainPage/RecommendedSection.css';

const RecommendedSection = () => {
  const { auth } = useContext(AuthContext);
  const isAuthenticated = auth?.isAuthenticated;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [recommendedArticles, setRecommendedArticles] = useState([]);
  const [hasRecommendations, setHasRecommendations] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      const saved = sessionStorage.getItem("recommendedArticles");
      if (saved) {
        const parsed = JSON.parse(saved);
        setRecommendedArticles(parsed);
        setHasRecommendations(parsed.length > 0);
      }
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      sessionStorage.removeItem("recommendedArticles");
      setRecommendedArticles([]);
      setHasRecommendations(true);
    }
  }, [isAuthenticated]);

  const fetchRecommendations = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${SUGGEST_API}/UserData/recommendations/${auth.user.id}`);
      const articles = response.data || [];
      setRecommendedArticles(articles);
      setHasRecommendations(articles.length > 0);
      sessionStorage.setItem("recommendedArticles", JSON.stringify(articles));
    } catch (error) {
      console.warn("⚠️ No se pudieron obtener recomendaciones:", error);
      setHasRecommendations(false);
    } finally {
      setLoading(false);
    }
  };

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
          <p>🔄 Cargando recomendaciones...</p>
        ) : !recommendedArticles.length ? (
          <>
            <p>Aún no tenemos suficientes datos sobre tus intereses. Explora más artículos para obtener recomendaciones.</p>
            <button className="search-button" onClick={handleExplore}>
              Explorar artículos
            </button>
          </>
        ) : (
          <>
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
                  <p>
                    {art.publishedDate
                      ? new Date(art.publishedDate).toLocaleDateString()
                      : 'Fecha desconocida'}
                  </p>
                </div>
              ))}
            </div>

            <div style={{ marginTop: "1rem" }}>
              <button className="search-button" onClick={fetchRecommendations}>
                🔄 Obtener más recomendaciones
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RecommendedSection;
