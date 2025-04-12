import React from 'react';
import '../CSS/MainPage/SectionBlock.css';

const SectionBlock = ({ title, categories, description, popularArticles, recentPublications }) => {
  return (
    <div className="section-block">
      <div className="content-wrapper">
        <h2>{title}</h2>
        <div className="section-content">
          <div className="section-column">
            <p><strong>Browse journals and books in:</strong></p>
            <ul>
              {categories.map((cat, idx) => (
                <li key={idx}><a href="#">{cat}</a></li>
              ))}
            </ul>
          </div>
          <div className="section-column">
            <p>{description}</p>
            <h4>Popular Articles</h4>
            <ul>
              {popularArticles.map((art, idx) => (
                <li key={idx}>
                  <a href="#">{art.title}</a>
                  <p>{art.detail}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="section-column">
            <h4>Recent Publications</h4>
            <ul>
              {recentPublications.map((pub, idx) => (
                <li key={idx}>
                  <a href="#">{pub.title}</a>
                  <p>{pub.detail}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionBlock;
