import React from 'react';
import '../CSS/MainPage/ResourceLinks.css';

const ResourceLinks = () => {
  return (
    <section className="resource-links">
      <div className="content-wrapper">
        <div className="resource-column">
          <h3>Acerca de esta plataforma</h3>
          <ul>
            <li><a href="#">Ayuda ↗</a></li>
            <li><a href="#">Tutoriales en video ↗</a></li>
            <li><a href="#">Principios de privacidad ↗</a></li>
            <li><a href="#">Accesibilidad ↗</a></li>
          </ul>
        </div>
        <div className="resource-column">
          <h3>Explorar la plataforma</h3>
          <ul>
            <li><a href="#">Sindicaciones de contenido</a></li>
            <li><a href="#">Crear y gestionar alertas</a></li>
            <li><a href="#">Recomendaciones personalizadas</a></li>
            <li><a href="#">Explorar por tema</a></li>
          </ul>
        </div>
        <div className="resource-column">
          <h3>Explorar el IPN</h3>
          <ul>
            <li><a href="#">Conecta IPN ↗</a></li>
            <li><a href="#">Publica con el IPN ↗</a></li>
            <li><a href="#">Repositorio IPN ↗</a></li>
            <li><a href="#">Mendeley ↗</a></li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default ResourceLinks;
