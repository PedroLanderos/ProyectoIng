import React, { useState } from 'react';
import '../CSS/MainPage/SearchBar.css';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');

  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();

    if (title) {
      params.append("query", `title:"${title}"`);
    } else if (query) {
      params.append("query", query);
    }

    if (author) {
      params.append("author", author);
    }

    // 🔁 Cambiado a SearchArticle (coincide con App.js)
    navigate(`/SearchArticle?${params.toString()}`);
  };

  return (
    <div className="search-bar-container">
      <div className="content-wrapper">
        <p className="search-title">
          Busca los artículos más cheveres por sus campos jeje
        </p>
        <form className="search-form" onSubmit={handleSearch}>
          <div className="search-group">
            <label>Find articles with these terms</label>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ej: inteligencia artificial"
            />
          </div>
          <div className="search-group">
            <label>In this journal or book title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Journal of AI"
            />
          </div>
          <div className="search-group">
            <label>Autor(es)</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Ej: Juan Pérez"
            />
          </div>
          <button
            className="search-button"
            type="submit"
            disabled={!query && !title && !author}
          >
            🔍 Search
          </button>
          <a className="advanced-search-link" href="#">Advanced search</a>
        </form>
      </div>
    </div>
  );
};

export default SearchBar;
