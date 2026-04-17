import React, { createContext, useState, useEffect, useCallback } from 'react';

export const CategoryContext = createContext();

const API_URL = '/api/categories';

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const addCategory = async (categoryData) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData),
      });
      if (!response.ok) throw new Error('Failed to add category');
      const newCategory = await response.json();
      setCategories(prev => [...prev, newCategory]);
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, error: err.message };
    }
  };

  const deleteCategory = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete category');
      }
      setCategories(prev => prev.filter(c => c.id !== id));
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, error: err.message };
    }
  };

  return (
    <CategoryContext.Provider value={{ categories, loading, error, addCategory, deleteCategory, refreshCategories: fetchCategories }}>
      {children}
    </CategoryContext.Provider>
  );
};
