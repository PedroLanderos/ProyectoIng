import React from 'react';
import './CSS/ArticleDetails.css';

const mockArticle = {
  id: 'abc123',
  title: 'Machine Learning in Modern Healthcare',
  authors: [
    { name: 'Alice Johnson' },
    { name: 'Bob Smith' },
  ],
  abstract: 'This article explores the applications of machine learning in diagnosing diseases and predicting outcomes...',
  publishedDate: '2023-08-15',
  journal: 'Journal of AI in Medicine',
  downloadUrl: 'https://example.com/download.pdf',
  fullText: 'Machine learning is transforming healthcare by enabling faster diagnoses...',
  subjects: ['Artificial Intelligence', 'Healthcare', 'Predictive Models'],
  yearPublished: 2023,
  links: [
    { url: 'https://example.com/more-info' },
    { url: 'https://example.com/source' },
  ],
};

const ArticleDetails = () => {
  const article = mockArticle;

  return (
    <div className="article-details">
      <div className="content-wrapper">
        <h1>{article.title}</h1>
        <p className="subtitle">{article.journal} — {article.yearPublished}</p>

        <div className="meta-info">
          <p><strong>Publicado:</strong> {new Date(article.publishedDate).toLocaleDateString()}</p>
          <p><strong>Autores:</strong> {article.authors.map(a => a.name).join(', ')}</p>
          <p><strong>Temas:</strong> {article.subjects.join(', ')}</p>
        </div>

        <div className="section">
          <h3>Resumen</h3>
          <p>{article.abstract}</p>
        </div>

        {article.fullText && (
          <div className="section">
            <h3>Texto completo</h3>
            <p>{article.fullText}</p>
          </div>
        )}

        <div className="section">
          <h3>Enlaces</h3>
          <ul>
            {article.downloadUrl && (
              <li>
                <a href={article.downloadUrl} target="_blank" rel="noopener noreferrer">
                  Descargar PDF
                </a>
              </li>
            )}
            {article.links.map((link, index) => (
              <li key={index}>
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  Fuente adicional {index + 1}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetails;
