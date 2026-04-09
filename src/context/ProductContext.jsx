import React, { createContext, useState, useEffect } from 'react';
import initialProducts from '../data/products.json';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const formatPrice = (price) => {
    if (!price) return '';
    const trimmed = String(price).trim();
    return trimmed.includes('৳') ? trimmed : `${trimmed} ৳`;
  };

  const [products, setProducts] = useState(() => {
    const savedProducts = localStorage.getItem('ar_farm_products_v2');
    const data = savedProducts ? JSON.parse(savedProducts) : initialProducts;
    // Auto-fix any missing symbols in existing data
    return data.map(p => ({ ...p, price: formatPrice(p.price) }));
  });

  useEffect(() => {
    localStorage.setItem('ar_farm_products_v2', JSON.stringify(products));
  }, [products]);

  const addProduct = (newProduct) => {
    const formattedProduct = { 
      ...newProduct, 
      id: Date.now(),
      price: formatPrice(newProduct.price)
    };
    setProducts([...products, formattedProduct]);
  };

  const deleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const updateProduct = (updatedProduct) => {
    const formattedProduct = {
      ...updatedProduct,
      price: formatPrice(updatedProduct.price)
    };
    setProducts(products.map(p => p.id === updatedProduct.id ? formattedProduct : p));
  };

  // Reset to defaults (from JSON)
  const resetToDefaults = () => {
    setProducts(initialProducts);
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, deleteProduct, updateProduct, resetToDefaults }}>
      {children}
    </ProductContext.Provider>
  );
};
