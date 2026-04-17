import React from 'react';
import licenseImg from '../assets/images/trade_license.jpg';
import './About.css';

const About = () => {
  return (
    <section id="about" className="about-section">
      <div className="about-content">
        <h2 className="section-heading">Our Mission</h2>
        <p className="section-body">
          AR Hydroponic & Aquaponic Farm's mission is to use aquaponics farming as a tool to increase food security, combat climate change and strengthen community resilience for our local residents.
        </p>
        
        <h2 className="section-heading" style={{marginTop: '60px'}}>How We Grow</h2>
        <p className="section-body">
          Our farming practice is rooted in Traditional Ecological Knowledge i.e. we use low-tech, easily adaptable and accessible growing techniques rooted in symbiosis. We rely primarily on fish waste to fertilize our plants so we feed our fish a varied diet including watercress, water hyacinth and other leafy greens grown on the farm, black soldier fly larvae, and fish pellets. To manage pests and diseases, we utilize Integrated Pest Management (IPM) techniques.
        </p>

        <div className="credentials-section" style={{marginTop: '80px'}}>
          <h3 className="section-heading" style={{fontSize: '2rem'}}>Official License</h3>
          <img 
            src={licenseImg} 
            alt="Official Trade License" 
            style={{maxWidth: '100%', height: 'auto', borderRadius: '12px', boxShadow: '0 20px 40px rgba(0,0,0,0.15)'}} 
          />
        </div>
      </div>
    </section>
  );
};

export default About;
