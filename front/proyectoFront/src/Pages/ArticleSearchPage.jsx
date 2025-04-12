import React, { useState } from 'react';
import SearchBar from './MainPage/SearchBar';
import './CSS/ArticleSearchPage.css';

const ArticleSearchPage = () => {
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    // Aquí podrías llamar a una API o filtrar tus datos locales
    console.log('Buscando:', query);
  };

  const dummyResults = [
    {
      title: 'Absorption',
      subtitle: 'Fundamentals & Applications',
      type: 'Book',
      year: 1993,
    },
    {
      title: 'Academia to Biotechnology',
      subtitle: 'Career Changes at Any Stage',
      type: 'Book',
      year: 2005,
    },
    {
      title: 'Accident Analysis & Prevention',
      subtitle: 'Journal',
      type: 'Journal',
      year: 'Contains open access',
    },
  ];

  return (
    <div className="article-search-page">
      <SearchBar onSearch={handleSearch} />

      <div className="article-results-wrapper">
        <h2>Showing 1,953 publications</h2>

        <input
          className="article-search-input"
          type="text"
          placeholder="Filter by journal or book title"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <div className="article-hints">
          <p>🔍 Are you looking for a specific article or book chapter? Use <a href="#">advanced search</a>.</p>
          <p>🔍 Are you looking for a journal to publish your research? <a href="#">Select journals to compare</a>.</p>
        </div>

        <div className="letter-section">
          <h3>A</h3>
          {dummyResults.map((item, index) => (
            <div key={index} className="result-item">
              <a className="result-title" href="#">{item.title}</a>
              <p className="result-subtitle">{item.subtitle}</p>
              <p className="result-meta">
                {item.type} • <span>{item.year}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArticleSearchPage;
