import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './CSS/ArticleDetails.css';
import { ARTICLES_API } from '../config/apiConfig';

const ArticleDetails = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(`${ARTICLES_API}/article/${id}`);
        setArticle(response.data);
      } catch (error) {
        console.error("❌ Error fetching article:", error);
        alert("❌ No se pudo cargar el artículo.");
      }
      setLoading(false);
    };

    fetchArticle();
  }, [id]);

  if (loading) return <p>🔄 Cargando artículo...</p>;
  if (!article) return <p>❌ Artículo no encontrado.</p>;

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
            {article.links?.map((link, index) => (
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
