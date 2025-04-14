import React from 'react';
import '../CSS/MainPage/ResourceLinks.css';

const ResourceLinks = () => {
  return (
    <section className="resource-links">
      <div className="content-wrapper">
        <div className="resource-column">
          <h3>Sobre la API</h3>
          <ul>
            <li>
              <a href="https://core.ac.uk/services/api" target="_blank" rel="noopener noreferrer">
                CORE API ↗
              </a>
            </li>
          </ul>
        </div>

        <div className="resource-column">
          <h3>Nuestra Escuela</h3>
          <ul>
            <li>
              <a href="https://www.escom.ipn.mx/" target="_blank" rel="noopener noreferrer">
                ESCOM ↗
              </a>
            </li>
          </ul>
        </div>

        <div className="resource-column">
          <h3>Institución</h3>
          <ul>
            <li>
              <a href="https://www.ipn.mx/" target="_blank" rel="noopener noreferrer">
                IPN ↗
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default ResourceLinks;
