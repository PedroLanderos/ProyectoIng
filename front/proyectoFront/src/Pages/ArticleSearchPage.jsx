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

  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get("query") || "";
  const initialAuthor = queryParams.get("author") || "";

  const pageSize = 10;

  const fetchResults = useCallback(async () => {
    if (loading || !hasMore || rateLimited) return;

    setLoading(true);

    try {
      const response = await axios.get(`${ARTICLES_API}/article/search`, {
        params: {
          query,
          author,
          page,
          pageSize,
        },
      });

      const newArticles = response.data.results || [];

      setArticles(prev => page === 1 ? newArticles : [...prev, ...newArticles]);
      setTotal(response.data.totalHits || 0);

      if ((page - 1) * pageSize + newArticles.length >= (response.data.totalHits || 0)) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("❌ Error fetching articles:", error);

      if (error.response?.status === 429) {
        alert("⚠️ Has alcanzado el límite de búsquedas. Espera 1 minuto para continuar.");
        setRateLimited(true);
        setTimeout(() => setRateLimited(false), 60000); // 1 minuto
      } else {
        alert("❌ Ocurrió un error al buscar artículos.");
        setHasMore(false);
      }
    }

    setLoading(false);
  }, [page, query, author, loading, hasMore, rateLimited]);

  useEffect(() => {
    setQuery(initialQuery);
    setAuthor(initialAuthor);
    setPage(1);
    setHasMore(true);
    setArticles([]);
  }, [initialQuery, initialAuthor]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const handleSearch = () => {
    setArticles([]);
    setPage(1);
    setHasMore(true);
    fetchResults();
  };

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 100 >=
        document.documentElement.offsetHeight &&
        hasMore &&
        !loading &&
        !rateLimited
      ) {
        setPage(prevPage => prevPage + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, loading, rateLimited]);

  return (
    <div className="article-search-page">
      <div className="article-results-wrapper">
        <h2>
          Showing {total > 1000 ? "+1000" : total} publications
        </h2>

        <div className="filter-form">
          <input
            className="article-search-input"
            type="text"
            placeholder="Search by topic or title"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <input
            className="article-search-input"
            type="text"
            placeholder="Search by author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
          <button className="search-button" onClick={handleSearch}>
            🔍 Buscar
          </button>
        </div>

        <div className="letter-section">
          <h3>Results</h3>
          {articles.map((item, index) => (
            <div
              key={index}
              className="result-item"
              onClick={() => navigate(`/ArticleDetail/${item.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <span className="result-title" style={{ color: '#0077cc', textDecoration: 'underline' }}>
                {item.title || "Untitled"}
              </span>
              <p className="result-subtitle">{item.abstract || "No abstract available"}</p>
              <p className="result-meta">
                {item.documentType || "Unknown Type"} •{" "}
                <span>{item.yearPublished || "N/A"}</span>
              </p>
            </div>
          ))}

          {loading && <p>🔄 Loading more articles...</p>}
          {rateLimited && <p>⏳ Esperando para continuar por límite de peticiones...</p>}
          {!hasMore && articles.length > 0 && <p>✅ All articles loaded.</p>}
        </div>
      </div>
    </div>
  );
};

export default ArticleSearchPage;
