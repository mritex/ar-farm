import React from 'react';
import educationImg from '../assets/images/education.png';
import corporateImg from '../assets/images/corporate.png';
import './Programs.css';

const Programs = () => {
  return (
    <section id="programs" className="programs-section">
      <div className="programs-container">
        
        <div className="program-block">
          <div className="program-content">
            <img src={educationImg} alt="Aquaponics Education" className="program-image" />
            <h2 className="program-title">AQUAPONICS EDUCATION</h2>
            <p className="program-desc">We offer immersive training and workshops for all age groups to learn the science and practice of aquaponics in a real-world urban farming environment.</p>
            <a href="#" className="btn-outline">Learn More...</a>
          </div>
        </div>

        <div className="program-block alternate">
          <div className="program-content">
            <img src={corporateImg} alt="Corporate Engagement" className="program-image" />
            <h2 className="program-title">CORPORATE ENGAGEMENT</h2>
            <p className="program-desc">Partner with us for unique corporate offsites, team-building volunteer days, and sustainability initiatives tailored to your organization's goals.</p>
            <a href="#" className="btn-outline">Learn More...</a>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Programs;
