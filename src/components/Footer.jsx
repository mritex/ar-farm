import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import logoImg from '../assets/images/ar_logo_final.png';
import './Footer.css';

const Footer = () => {
  return (
    <footer id="contact" className="footer-section">
      <div className="footer-container">
        
        <div className="footer-info">
          <img src={logoImg} alt="AR Farm Logo" className="footer-logo" />
          <h3 className="footer-title">AR Farm</h3>
          <p className="footer-tagline">Sustainable • Innovative • Fresh</p>
        </div>

        <div className="footer-contact">
          <h4 className="footer-heading">Visit Us</h4>
          <p><MapPin size={18} className="icon"/> Kurkuchikanda . Taldidhi .Tarakanda .Mymensingh</p>
          <br/>
          <h4 className="footer-heading">Contact Us</h4>
          <p><Phone size={18} className="icon"/> +8801742321888</p>
          <p><Mail size={18} className="icon"/> mrbestdiling@gmail.com</p>
        </div>

      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} AR Hydroponic & Aquaponic Farm.</p>
      </div>
    </footer>
  );
};

export default Footer;
