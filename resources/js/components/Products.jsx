import React from 'react';
import custom1 from '../assets/images/custom_1.jpeg';
import custom2 from '../assets/images/custom_4.jpeg';
import './Products.css';

const Products = () => {
  return (
    <section id="products" className="products-section">
      
      {/* Category 1: Vegetables (Image Left, Text Right) */}
      <div className="split-row">
        <div className="split-image" style={{ backgroundImage: `url(${custom1})` }}></div>
        <div className="split-content">
          <h2 className="split-title">What We Grow</h2>
          <p className="split-desc">
            We cultivate a wide variety of vegetables, herbs, fruits, medicinal plants and flowers that demonstrate the range of plants capable of growing in an aquaponics system. 
          </p>
          <p className="split-desc">
            Some of the crops we grow include cabbage, onions, leeks, carrots, sweet potatoes, lemongrass, cilantro, millet sorghum, okra, peas, peppers, tomatoes, indigo, cosmos, marigolds, lemon balm, marshmallow etc.
          </p>

        </div>
      </div>

      {/* Category 2: Fish (Text Left, Image Right) */}
      <div className="split-row reverse-row">
        <div className="split-image" style={{ backgroundImage: `url(${custom2})` }}></div>
        <div className="split-content">
          <h2 className="split-title">Our Fish</h2>
          <p className="split-desc">
            Sustainably raised in our clean aquaponics ecosystem. Our fish include mirror carp, catfish, goldfish, koi, bluegill, crawfish and freshwater prawns.
          </p>
        </div>
      </div>

    </section>
  );
};

export default Products;
