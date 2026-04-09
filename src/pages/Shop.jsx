import React, { useContext } from 'react';
import './Shop.css';
import { ProductContext } from '../context/ProductContext';

const Shop = () => {
  const { products } = useContext(ProductContext);

  const handleOrder = (product) => {
    const phoneNumber = '+8801742321888'; // As requested by user
    const pureNumber = phoneNumber.replace(/\+/g, ''); // WhatsApp API prefers without the '+' 
    const productLink = window.location.href;
    const weightInfo = product.weight ? ` [${product.weight}]` : '';
    const message = `Hello AR Farm! I am interested in ordering: ${product.name}${weightInfo} (${product.price}). Is this currently available?\n\nProduct Link: ${productLink}`;
    const whatsappUrl = `https://wa.me/${pureNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Define the categories we want to display
  const categories = [
    { title: 'Fresh Vegetables', type: 'Vegetable' },
    { title: 'Aromatic Herbs', type: 'Herb' },
    { title: 'Seasonal Fruits', type: 'Fruit' },
    { title: 'Fresh Fish', type: 'Fish' }
  ];

  return (
    <div className="shop-page">
      <div className="shop-header">
        <h1 className="shop-title">Farm Shop</h1>
        <p className="shop-subtitle">Pure, organic, and locally grown directly from our advanced hydroponic & aquaponic systems.</p>
      </div>

      <div className="shop-container">
        {categories.map((cat) => {
          const categoryProducts = products.filter(p => p.type === cat.type);
          
          if (categoryProducts.length === 0) return null;

          return (
            <div key={cat.type} className="shop-category-section">
              <h2 className="category-heading">{cat.title}</h2>
              <div className="product-grid">
                {categoryProducts.map((product) => (
                  <div key={product.id} className="product-card">
                    <div 
                      className="product-image" 
                      style={{ backgroundImage: `url(${product.img || 'https://via.placeholder.com/300'})` }}
                    ></div>
                    <div className="product-info">
                      <span className="product-type">{product.type}</span>
                      <h3 className="product-name">{product.name}</h3>
                      {product.weight && <p className="product-weight">{product.weight}</p>}
                      <p className="product-price">{product.price}</p>
                      <button className="btn-buy" onClick={() => handleOrder(product)}>Order via WhatsApp</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Shop;
