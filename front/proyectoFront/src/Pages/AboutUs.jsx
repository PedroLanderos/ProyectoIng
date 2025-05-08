import React from 'react';
import './CSS/AboutUs.css';

const AboutUs = () => {
  return (
    <div className="about-us">
      <div className="about-us-container">
        <h1>Sobre Nosotros</h1>
        <p className="intro">
          Somos dos desarrolladores apasionados con más de 4 años de experiencia creando soluciones digitales.
        </p>
        <div className="about-us-details">
          <p>Actualmente estudiamos Ingeniería en Sistemas Computacionales y nos especializamos en el desarrollo web.</p>
          <p>
            Nos encanta construir interfaces intuitivas, eficientes y accesibles, combinando diseño moderno con buenas
            prácticas de programación.
          </p>
          <p>
            Nuestro objetivo es ofrecer aplicaciones confiables y escalables que realmente aporten valor a las personas.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
