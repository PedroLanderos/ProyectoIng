import React from 'react';
import '../CSS/MainPage/HeroSlider.css';
import coreImage from '../../Images/imagencoreapi.png'; // Imagen local

const HeroSlider = () => {
  return (
    <section className="hero-slider">
      <div className="hero-slide">
        <div className="hero-image">
          <img
            src={coreImage}
            alt="CORE API background"
          />
        </div>
        <div className="hero-content">
          <div className="hero-left">
            <h1>EUREKA,<br />EVERY DAY</h1>
          </div>
          <div className="hero-right">
            <p>
              Accede y explora millones de artículos científicos proporcionados por <strong>CORE API</strong>, una de las fuentes de conocimiento abierto más grandes del mundo.
            </p>
            <a
              href="https://core.ac.uk/services/api"
              className="hero-button"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ir a CORE API ↗
            </a>
          </div>
        </div>
      </div>

      {/* Navegación eliminada como solicitaste */}
    </section>
  );
};

export default HeroSlider;
