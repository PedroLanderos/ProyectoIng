import React from 'react';
import '../CSS/MainPage/HeroSlider.css';

const HeroSlider = () => {
  return (
    <section className="hero-slider">
      <div className="hero-slide">
        <div className="hero-image">
          <img
            src="https://images.unsplash.com/photo-1533049022229-62a9f2e1e1b8?auto=format&fit=crop&w=1600&q=80"
            alt="Hero background"
          />
        </div>
        <div className="hero-content">
          <div className="hero-left">
            <h1>EUREKA,<br />EVERY DAY</h1>
          </div>
          <div className="hero-right">
            <p>
              Instantly surface, cite, compare and explore trusted evidence from deep within
              peer-reviewed literature with ScienceDirect AI.
            </p>
            <a href="#" className="hero-button">Explore ScienceDirect AI ↗</a>
          </div>
        </div>
      </div>

      <div className="hero-navigation">
        <div className="dots">
          <span className="dot active"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
        <div className="nav-labels">
          <p>ScienceDirect AI</p>
          <p>Confidence in research</p>
          <p>Climate change</p>
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;
