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
    let data = savedProducts ? JSON.parse(savedProducts) : initialProducts;
    
    // Auto-sync: If saved data is missing products from the master JSON (initialProducts), add them.
    // This handles the case where new products were added to the code.
    const existingIds = new Set(data.map(p => p.id));
    let mergedData = [...data];

    initialProducts.forEach(ip => {
      if (!existingIds.has(ip.id)) {
        mergedData.push(ip);
      }
    });

    // Auto-fix price formats and ensure consistency
    return mergedData.map(p => ({ ...p, price: formatPrice(p.price) }));
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
    localStorage.setItem('ar_farm_products_v2', JSON.stringify(initialProducts));
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, deleteProduct, updateProduct, resetToDefaults }}>
      {children}
    </ProductContext.Provider>
  );
};
