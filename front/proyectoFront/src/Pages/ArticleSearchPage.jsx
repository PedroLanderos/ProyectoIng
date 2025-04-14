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

  const [lastScrollTime, setLastScrollTime] = useState(0);
  const [searchCooldown, setSearchCooldown] = useState(false);

  const [initialLoadedFromStorage, setInitialLoadedFromStorage] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get("query") || "";
  const initialAuthor = queryParams.get("author") || "";

  const pageSize = 10;

  // 🔁 Cargar búsqueda guardada
  useEffect(() => {
    const saved = sessionStorage.getItem("articleSearchState");
    if (saved) {
      const {
        articles,
        total,
        query,
        author,
        page
      } = JSON.parse(saved);

      setArticles(articles || []);
      setTotal(total || 0);
      setQuery(query || "");
      setAuthor(author || "");
      setPage(page || 1);
      setHasMore(true);
      setInitialLoadedFromStorage(true);
    } else {
      setQuery(initialQuery);
      setAuthor(initialAuthor);
      setPage(1);
      setHasMore(true);
      setArticles([]);
      setInitialLoadedFromStorage(true);
    }
  }, [initialQuery, initialAuthor]);

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

      const combinedArticles = page === 1 ? newArticles : [...articles, ...newArticles];

      // 🧠 Guardar en sessionStorage
      sessionStorage.setItem(
        "articleSearchState",
        JSON.stringify({
          articles: combinedArticles,
          total: response.data.totalHits || 0,
          query,
          author,
          page
        })
      );

      setArticles(combinedArticles);
      setTotal(response.data.totalHits || 0);

      if ((page - 1) * pageSize + newArticles.length >= (response.data.totalHits || 0)) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("❌ Error fetching articles:", error);

      if (error.response?.status === 429) {
        alert("⚠️ Has alcanzado el límite de búsquedas. Espera 1 minuto para continuar.");
        setRateLimited(true);
        setTimeout(() => setRateLimited(false), 60000);
      } else {
        alert("❌ Ocurrió un error al buscar artículos.");
        setHasMore(false);
      }
    }

    setLoading(false);
  }, [page, query, author, loading, hasMore, rateLimited, articles]);

  useEffect(() => {
    if (initialLoadedFromStorage && articles.length === 0) {
      fetchResults();
    }
  }, [fetchResults, initialLoadedFromStorage]);

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
    fetchResults();
  };

  useEffect(() => {
    const handleScroll = () => {
      const now = Date.now();

      if (
        window.innerHeight + document.documentElement.scrollTop + 100 >=
          document.documentElement.offsetHeight &&
        hasMore &&
        !loading &&
        !rateLimited &&
        now - lastScrollTime > 3000
      ) {
        setLastScrollTime(now);
        setPage(prevPage => prevPage + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, loading, rateLimited, lastScrollTime]);

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
          <button className="search-button" onClick={handleSearch} disabled={searchCooldown}>
            🔍 Buscar
          </button>
        </div>

        <div className="letter-section">
          <h3>Results</h3>
          {articles.map((item, index) => (
            <div
              key={index}
              className="result-item"
              onClick={() => window.open(`/ArticleDetail/${item.id}`, '_blank')}
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
