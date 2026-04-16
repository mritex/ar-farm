import React, { createContext, useState, useEffect, useCallback } from 'react';
import initialProducts from '../data/products.json';

export const ProductContext = createContext();

// API base URL — in production, the API is at the same domain under /api/
// In development, Vite proxy forwards /api to the PHP server
const API_URL = '/api/products.php';

export const ProductProvider = ({ children }) => {
  const formatPrice = (price) => {
    if (!price) return '';
    const trimmed = String(price).trim();
    return trimmed.includes('৳') ? trimmed : `${trimmed} ৳`;
  };

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all products from the database
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setProducts(data.map(p => ({ ...p, price: formatPrice(p.price) })));
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Failed to fetch products from API, using fallback:', err);
      setError(err.message);

      // Fallback: try localStorage, then initial JSON
      const savedProducts = localStorage.getItem('ar_farm_products_v2');
      if (savedProducts) {
        setProducts(JSON.parse(savedProducts).map(p => ({ ...p, price: formatPrice(p.price) })));
      } else {
        setProducts(initialProducts.map(p => ({ ...p, price: formatPrice(p.price) })));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Also keep localStorage in sync as a backup cache
  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem('ar_farm_products_v2', JSON.stringify(products));
    }
  }, [products]);

  const addProduct = async (newProduct) => {
    const formattedProduct = {
      ...newProduct,
      price: formatPrice(newProduct.price),
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedProduct),
      });

      if (!response.ok) {
        throw new Error(`Failed to add product: ${response.status}`);
      }

      const savedProduct = await response.json();
      savedProduct.price = formatPrice(savedProduct.price);
      setProducts(prev => [...prev, savedProduct]);
      return { success: true };
    } catch (err) {
      console.error('Failed to add product:', err);
      // Fallback: add locally with timestamp ID
      const localProduct = { ...formattedProduct, id: Date.now() };
      setProducts(prev => [...prev, localProduct]);
      return { success: false, error: err.message };
    }
  };

  const deleteProduct = async (id) => {
    try {
      const response = await fetch(`${API_URL}?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete product: ${response.status}`);
      }

      setProducts(prev => prev.filter(p => p.id !== id));
      return { success: true };
    } catch (err) {
      console.error('Failed to delete product:', err);
      // Fallback: remove locally anyway
      setProducts(prev => prev.filter(p => p.id !== id));
      return { success: false, error: err.message };
    }
  };

  const updateProduct = async (updatedProduct) => {
    const formattedProduct = {
      ...updatedProduct,
      price: formatPrice(updatedProduct.price),
    };

    try {
      const response = await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedProduct),
      });

      if (!response.ok) {
        throw new Error(`Failed to update product: ${response.status}`);
      }

      const savedProduct = await response.json();
      savedProduct.price = formatPrice(savedProduct.price);
      setProducts(prev => prev.map(p => p.id === updatedProduct.id ? savedProduct : p));
      return { success: true };
    } catch (err) {
      console.error('Failed to update product:', err);
      // Fallback: update locally
      setProducts(prev => prev.map(p => p.id === updatedProduct.id ? formattedProduct : p));
      return { success: false, error: err.message };
    }
  };

  // Reset to defaults (from JSON) — emergency use only
  const resetToDefaults = () => {
    setProducts(initialProducts.map(p => ({ ...p, price: formatPrice(p.price) })));
    localStorage.setItem('ar_farm_products_v2', JSON.stringify(initialProducts));
  };

  return (
    <ProductContext.Provider value={{
      products,
      loading,
      error,
      addProduct,
      deleteProduct,
      updateProduct,
      resetToDefaults,
      refreshProducts: fetchProducts,
    }}>
      {children}
    </ProductContext.Provider>
  );
};
