import React, { createContext, useState, useEffect, useCallback } from 'react';

export const ProductContext = createContext();

const API_URL = '/api/products';

export const ProductProvider = ({ children }) => {
  const formatPrice = (price) => {
    if (!price) return '';
    const trimmed = String(price).trim();
    return trimmed.includes('৳') ? trimmed : `${trimmed} ৳`;
  };

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const data = await response.json();
      setProducts(data.map(p => ({ ...p, price: formatPrice(p.price) })));
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addProduct = async (newProduct) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      });
      if (!response.ok) throw new Error(`Failed to add product: ${response.status}`);
      const savedProduct = await response.json();
      savedProduct.price = formatPrice(savedProduct.price);
      setProducts(prev => [...prev, savedProduct]);
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, error: err.message };
    }
  };

  const deleteProduct = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error(`Failed to delete product: ${response.status}`);
      setProducts(prev => prev.filter(p => p.id !== id));
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, error: err.message };
    }
  };

  const updateProduct = async (updatedProduct) => {
    try {
      const response = await fetch(`${API_URL}/${updatedProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct),
      });
      if (!response.ok) throw new Error(`Failed to update product: ${response.status}`);
      const savedProduct = await response.json();
      savedProduct.price = formatPrice(savedProduct.price);
      setProducts(prev => prev.map(p => p.id === updatedProduct.id ? savedProduct : p));
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, error: err.message };
    }
  };

  return (
    <ProductContext.Provider value={{
      products,
      loading,
      error,
      addProduct,
      deleteProduct,
      updateProduct,
      refreshProducts: fetchProducts,
    }}>
      {children}
    </ProductContext.Provider>
  );
};
