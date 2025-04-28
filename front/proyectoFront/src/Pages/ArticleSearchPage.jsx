import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
  const [searchError, setSearchError] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get("query") || "";
  const initialAuthor = queryParams.get("author") || "";

  const pageSize = 10;

  useEffect(() => {
    sessionStorage.removeItem("articleSearchState");
    setQuery(initialQuery);
    setAuthor(initialAuthor);
    setPage(1);
    setArticles([]);
    setHasMore(true);
    setSearchError(false);
  }, [location.key]);

  useEffect(() => {
    const newParams = new URLSearchParams();
    if (query) newParams.set("query", query);
    if (author) newParams.set("author", author);
    const newUrl = `/SearchArticle?${newParams.toString()}`;
    window.history.replaceState(null, "", newUrl);
  }, [query, author]);

  const fetchResults = useCallback(async (isNewSearch = false) => {
    if (loading || rateLimited || (!hasMore && !isNewSearch)) return;
    setLoading(true);
    setSearchError(false);

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
      setHasMore(nextPage * pageSize < (response.data.totalHits || 0));
    } catch (error) {
      console.error("❌ Error fetching articles:", error);
      setSearchError(true); // 🚨 Marcar que hubo error
      if (error.response?.status === 429) {
        alert("⚠️ Límite alcanzado. Intenta en 1 minuto.");
        setRateLimited(true);
        setTimeout(() => setRateLimited(false), 60000);
      } else {
        alert("❌ Error inesperado al buscar artículos.");
      }
    }

    setLoading(false);
  }, [query, author, page, articles, hasMore, rateLimited, loading]);

  useEffect(() => {
    if (initialQuery || initialAuthor) {
      fetchResults(true);
    }
  }, [initialQuery, initialAuthor, fetchResults]);

  const handleSearch = () => {
    setArticles([]);
    setPage(1);
    setHasMore(true);
    setSearchError(false);
    sessionStorage.removeItem("articleSearchState");
    fetchResults(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }

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
            onKeyDown={handleKeyDown}
          />
          <input
            className="article-search-input"
            type="text"
            placeholder="Buscar por autor"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className="search-button" onClick={handleSearch}>
            🔍 Buscar
          </button>
        </div>

        <div className="letter-section">
          {articles.length > 0 && <h3>Resultados</h3>}

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

          {rateLimited && <p>⏳ Esperando por límite de peticiones...</p>}

          {!searchError && !hasMore && articles.length > 0 && (
            <p>✅ Todos los artículos han sido cargados.</p>
          )}

          {!loading && !rateLimited && !searchError && hasMore && articles.length > 0 && (
            <button className="search-button" onClick={() => fetchResults(false)}>
              🔽 Cargar más
            </button>
          )}

          {loading && articles.length > 0 && (
            <p>🔄 Cargando más artículos...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticleSearchPage;
