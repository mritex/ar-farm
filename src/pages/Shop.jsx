import React from 'react';
import './Shop.css';
import ruiImg from '../assets/images/rui.png';
import catfishImg from '../assets/images/catfish.png';
import pabdaImg from '../assets/images/pabda.png';
import lettuceImg from '../assets/images/lettuce.png';
import oreganoImg from '../assets/images/oregano.png';
import custom2 from '../assets/images/custom_2.jpeg';

const MOCK_PRODUCTS = [
  { id: 1, name: 'Fresh Lettuce', price: '৳ 60', type: 'Vegetable', img: lettuceImg },
  { id: 2, name: 'Pudina (Mint)', price: '৳ 30', type: 'Herb', img: custom2 },
  { id: 3, name: 'Oregano', price: '৳ 150', type: 'Herb', img: oreganoImg },
  { id: 4, name: 'Rui Fish', price: '৳ 400', type: 'Fish', img: ruiImg },
  { id: 5, name: 'Cat Fish', price: '৳ 350', type: 'Fish', img: catfishImg },
  { id: 6, name: 'Pabda Fish', price: '৳ 500', type: 'Fish', img: pabdaImg },
];

const Shop = () => {
  const handleOrder = (product) => {
    const phoneNumber = '+8801742321888'; // As requested by user
    const pureNumber = phoneNumber.replace(/\+/g, ''); // WhatsApp API prefers without the '+' 
    const productLink = window.location.href;
    const message = `Hello AR Farm! I am interested in ordering: ${product.name} (${product.price}). Is this currently available?\n\nProduct Link: ${productLink}`;
    const whatsappUrl = `https://wa.me/${pureNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="shop-page">
      <div className="shop-header">
        <h1 className="shop-title">Farm Shop</h1>
        <p className="shop-subtitle">Pure, organic, and locally grown directly from our advanced hydroponic & aquaponic systems.</p>
      </div>

      <div className="shop-container">
        <div className="product-grid">
          {MOCK_PRODUCTS.map((product) => (
            <div key={product.id} className="product-card">
              <div 
                className="product-image" 
                style={{ backgroundImage: `url(${product.img})` }}
              ></div>
              <div className="product-info">
                <span className="product-type">{product.type}</span>
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">{product.price}</p>
                <button className="btn-buy" onClick={() => handleOrder(product)}>Order via WhatsApp</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Shop;
