import React from 'react';
import './CSS/SearchBar.css';

const SearchBar = () => {
  return (
    <div className="search-bar-container">
      <div className="content-wrapper">
        <p className="search-title">
          Busca los articulos mas chevere por sus campos jeje
        </p>
        <div className="search-form">
          <div className="search-group">
            <label>Find articles with these terms</label>
            <input type="text" />
          </div>
          <div className="search-group">
            <label>In this journal or book title</label>
            <input type="text" />
          </div>
          <div className="search-group">
            <label>Autor(es)</label>
            <input type="text" />
          </div>
          <button className="search-button">
            🔍 Search
          </button>
          <a className="advanced-search-link" href="#">Advanced search</a>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
