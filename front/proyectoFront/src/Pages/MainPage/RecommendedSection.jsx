import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';
import '../CSS/MainPage/RecommendedSection.css';

const RecommendedSection = () => {
  const { auth } = useContext(AuthContext);
  const isAuthenticated = auth?.isAuthenticated;
  const navigate = useNavigate();

  const hasRecommendations = true; // Simulación
  const recommendedArticles = [
    {
      id: '123456',
      title: 'How AI is Transforming Game Design',
      detail: 'Gaming Tech Journal, 2022',
    },
    {
      id: '654321',
      title: 'Procedural Storytelling with Machine Learning',
      detail: 'Interactive Media Review, 2021',
    },
  ];

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
                  {art.title}
                </a>
                <p>{art.detail}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendedSection;
