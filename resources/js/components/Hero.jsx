import React, { useState, useEffect } from 'react';
import slide1 from '../assets/hero_bg.png';
import slide2 from '../assets/images/slide_2.png';
import slide3 from '../assets/images/slide_3.png';
import './Hero.css';

const slides = [slide1, slide2, slide3];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="home" className="hero">
      
      {slides.map((slide, index) => (
        <div 
          key={index}
          className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
          style={{ backgroundImage: `url(${slide})` }}
        ></div>
      ))}
      
      <div className="hero-overlay"></div>
      
      <div className="hero-content animate-fade-in">
        <h1 className="hero-title">AR Hydroponic &<br/>Aquaponic Farm</h1>
        <p className="hero-subtitle">Cultivating a sustainable future in the heart of our community.</p>
      </div>

      <div className="hero-dots">
        {slides.map((_, index) => (
          <span 
            key={index} 
            className={`dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
          ></span>
        ))}
      </div>
      
    </section>
  );
};

export default Hero;
