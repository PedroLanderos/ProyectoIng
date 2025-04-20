import React, { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './CSS/ArticleSearchPage.css';
import { ARTICLES_API } from '../config/apiConfig';

const ArticleSearchPage = () => {
  const [articles, setArticles] = useState([]);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState('');
  const [author, setAuthor] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [rateLimited, setRateLimited] = useState(false);
  const [searchCooldown, setSearchCooldown] = useState(false);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get("query") || "";
  const initialAuthor = queryParams.get("author") || "";

  const pageSize = 10;

  useEffect(() => {
    const saved = sessionStorage.getItem("articleSearchState");
    if (saved) {
      const { articles, total, query, author, page } = JSON.parse(saved);
      setArticles(articles || []);
      setTotal(total || 0);
      setQuery(query || "");
      setAuthor(author || "");
      setPage(page || 1);
      setHasMore(true);
    } else {
      setQuery(initialQuery);
      setAuthor(initialAuthor);
      setPage(1);
      setHasMore(true);
      setArticles([]);
    }
  }, [initialQuery, initialAuthor]);

  const fetchResults = useCallback(async (isNewSearch = false) => {
    if (loading || rateLimited || (!hasMore && !isNewSearch)) return;
    setLoading(true);

    try {
      const nextPage = isNewSearch ? 1 : page;
      const response = await axios.get(`${ARTICLES_API}/article/search`, {
        params: { query, author, page: nextPage, pageSize },
      });

      const newArticles = response.data.results || [];
      const combined = isNewSearch ? newArticles : [...articles, ...newArticles];

      sessionStorage.setItem(
        "articleSearchState",
        JSON.stringify({
          articles: combined,
          total: response.data.totalHits || 0,
          query,
          author,
          page: nextPage,
        })
      );

      setArticles(combined);
      setTotal(response.data.totalHits || 0);
      setPage(nextPage + 1);
      setHasMore((nextPage) * pageSize < (response.data.totalHits || 0));
    } catch (error) {
      console.error("❌ Error fetching articles:", error);
      if (error.response?.status === 429) {
        alert("⚠️ Límite alcanzado. Intenta en 1 minuto.");
        setRateLimited(true);
        setTimeout(() => setRateLimited(false), 60000);
      } else {
        alert("❌ Error inesperado al buscar artículos.");
        setHasMore(false);
      }
    }

    setLoading(false);
  }, [query, author, page, articles, hasMore, rateLimited, loading]);

  const handleSearch = () => {
    if (searchCooldown) {
      alert("⏳ Espera un momento antes de volver a buscar.");
      return;
    }

    setSearchCooldown(true);
    setTimeout(() => setSearchCooldown(false), 5000);

    setArticles([]);
    setPage(1);
    setHasMore(true);

    sessionStorage.removeItem("articleSearchState");

    fetchResults(true);
  };

  return (
    <div className="article-search-page">
      <div className="article-results-wrapper">
        <h2>
          Mostrando {total > 1000 ? "+1000" : total} publicaciones
        </h2>

        <div className="filter-form">
          <input
            className="article-search-input"
            type="text"
            placeholder="Buscar por tema o título"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <input
            className="article-search-input"
            type="text"
            placeholder="Buscar por autor"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
          <button className="search-button" onClick={handleSearch} disabled={searchCooldown}>
            🔍 Buscar
          </button>
        </div>

        <div className="letter-section">
          <h3>Resultados</h3>
          {articles.map((item, index) => (
            <div
              key={index}
              className="result-item"
              onClick={() => window.open(`/ArticleDetail/${item.id}`, '_blank')}
              style={{ cursor: 'pointer' }}
            >
              <span className="result-title" style={{ color: '#0077cc', textDecoration: 'underline' }}>
                {item.title || "Sin título"}
              </span>
              <p className="result-subtitle">{item.abstract || "Sin resumen disponible"}</p>
              <p className="result-meta">
                <strong>Autores:</strong>{" "}
                {item.authors && item.authors.length > 0
                  ? item.authors.map(a => a.name).join(', ')
                  : "Desconocidos"}
              </p>
              <p className="result-meta">
                {item.documentType || "Tipo desconocido"} •{" "}
                <span>{item.yearPublished || "N/A"}</span>
              </p>
            </div>
          ))}

          {loading && <p>🔄 Cargando más artículos...</p>}
          {rateLimited && <p>⏳ Esperando por límite de peticiones...</p>}
          {!hasMore && articles.length > 0 && <p>✅ Todos los artículos han sido cargados.</p>}

          {hasMore && !loading && !rateLimited && (
            <button className="search-button" onClick={() => fetchResults(false)}>
              🔽 Cargar más
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticleSearchPage;
