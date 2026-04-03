import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import logoImg from '../assets/images/ar_logo_final.png';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container navbar-container">
        <div className="logo">
          <a href="#home">
            <img src={logoImg} alt="AR Hydroponic Farm Logo" className="nav-logo-img" />
          </a>
        </div>
        
        <ul className="nav-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#products">Products</a></li>
          <li><a href="#programs">Programs</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>

        <div className="mobile-menu">
          <Menu size={28} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
