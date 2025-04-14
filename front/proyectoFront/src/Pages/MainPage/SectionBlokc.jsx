import React from 'react';
import '../CSS/MainPage/SectionBlock.css';

const SectionBlock = ({
  title,
  categories,
  description,
  popularArticles,
  onCategoryClick = () => {},
  onArticleClick = () => {},
}) => {
  return (
    <div className="section-block">
      <div className="content-wrapper">
        <h2>{title}</h2>
        <div className="section-content">
          <div className="section-column">
            <p><strong>Explore topics:</strong></p>
            <ul>
              {categories.map((cat, idx) => (
                <li key={idx}>
                  <a href="#" onClick={(e) => { e.preventDefault(); onCategoryClick(cat); }}>
                    {cat}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="section-column">
            <p>{description}</p>
            <h4>Popular Articles</h4>
            <ul>
              {popularArticles.map((art, idx) => (
                <li key={idx}>
                  <a href="#" onClick={(e) => { e.preventDefault(); onArticleClick(art.id); }}>
                    {art.title}
                  </a>
                  <p>{art.detail}</p>
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
