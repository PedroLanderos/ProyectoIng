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

  const pageSize = 10;

  // 🔁 Detectar parámetros de la URL una sola vez
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const initialQuery = queryParams.get("query") || "";
    const initialAuthor = queryParams.get("author") || "";

    setQuery(initialQuery);
    setAuthor(initialAuthor);
    setPage(1);
    setArticles([]);
    setHasMore(true);
    setSearchError(false);

    if (initialQuery || initialAuthor) {
      fetchResults(initialQuery, initialAuthor, 1, true);
    }
  }, [location.search]); // 👈 solo cambiar cuando cambia `search`, no `location.key`

  // 🔍 Buscar artículos
  const fetchResults = useCallback(async (queryToUse, authorToUse, pageToUse = 1, isNewSearch = false) => {
    if (loading || rateLimited) return;

    setLoading(true);
    setSearchError(false);

    try {
      const response = await axios.get(`${ARTICLES_API}/article/search`, {
        params: { query: queryToUse, author: authorToUse, page: pageToUse, pageSize },
      });

      const newArticles = response.data.results || [];
      const combined = isNewSearch ? newArticles : [...articles, ...newArticles];

      setArticles(combined);
      setTotal(response.data.totalHits || 0);
      setPage(pageToUse + 1);
      setHasMore(pageToUse * pageSize < (response.data.totalHits || 0));
    } catch (error) {
      console.error("❌ Error fetching articles:", error);
      setSearchError(true);
      setHasMore(false); // evitar más peticiones
    }

    setLoading(false);
  }, [loading, rateLimited, articles]);

  const handleSearch = () => {
    if (!query && !author) return;

    const params = new URLSearchParams();
    if (query) params.append("query", query);
    if (author) params.append("author", author);

    navigate(`/SearchArticle?${params.toString()}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="article-search-page">
      <div className="article-results-wrapper">
        <h2>Mostrando {total > 1000 ? "+1000" : total} publicaciones</h2>

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
            <button className="search-button" onClick={() => fetchResults(query, author, page)}>
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
