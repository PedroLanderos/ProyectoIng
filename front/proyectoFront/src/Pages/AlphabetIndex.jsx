import React from 'react';
import './CSS/AlphabetIndex.css';

const AlphabetIndex = () => {
  const letters = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ', '0-9'];

  return (
    <div className="alphabet-index">
      <div className="content-wrapper">
        <p className="alphabet-title">Browse by Publication Title:</p>
        <div className="alphabet-links">
          {letters.map((letter, index) => (
            <a key={index} href="#" className="alphabet-letter">
              {letter}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AlphabetIndex;
