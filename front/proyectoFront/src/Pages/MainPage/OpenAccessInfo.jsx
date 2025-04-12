import React from 'react';
import '../CSS/MainPage/OpenAccessInfo.css';

const OpenAccessInfo = () => {
  return (
    <section className="open-access">
      <div className="content-wrapper">
        <h2 className="open-access-title">
          3.3 millones de artículos en esta plataforma son de acceso abierto
        </h2>
        <p className="open-access-desc">
          Los artículos publicados en acceso abierto son revisados por pares y están disponibles gratuitamente para
          leer, descargar y reutilizar según la licencia del usuario que aparece en el artículo.
        </p>
        <ul className="open-access-links">
          <li>
            <a href="#">Ver lista completa de revistas y libros de acceso abierto</a>
          </li>
          <li>
            <a href="#">Ver todas las publicaciones con artículos de acceso abierto (incluye híbridos)</a>
          </li>
          <li>
            <a href="#">Más sobre las políticas de acceso abierto ↗</a>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default OpenAccessInfo;
