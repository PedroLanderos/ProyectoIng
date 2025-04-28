import React, { useState } from 'react';
import '../CSS/MainPage/SearchBar.css';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [author, setAuthor] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();

    if (query) {
      params.append("query", query);
    }

    if (author) {
      params.append("author", author);
    }

    if (params.toString()) {
      navigate(`/SearchArticle?${params.toString()}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  return (
    <div className="search-bar-container">
      <div className="content-wrapper">
        <p className="search-title">
          BUSCAR ARTICULOS(CAMBIAR TEXTO)
        </p>
        <form className="search-form" onSubmit={handleSearch}>
          <div className="search-group">
            <label>Término de búsqueda</label>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ej: inteligencia artificial"
            />
          </div>

          <div className="search-group">
            <label>Autor(es)</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ej: Juan Pérez"
            />
          </div>

          <button
            className="search-button"
            type="submit"
            disabled={!query && !author}
          >
            🔍 Buscar
          </button>
        </form>
      </div>
    </div>
  );
};

export default SearchBar;
