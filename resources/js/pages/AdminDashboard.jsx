import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductContext } from '../context/ProductContext';
import { CategoryContext } from '../context/CategoryContext';
import { PlusCircle, Trash2, Edit2, Package, LogOut, X, Upload, RefreshCw, Loader, AlertCircle, CheckCircle, Tag } from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { products, loading: productsLoading, error: productsError, addProduct, deleteProduct, updateProduct, refreshProducts } = useContext(ProductContext);
  const { categories, loading: categoriesLoading, addCategory, deleteCategory, refreshCategories } = useContext(CategoryContext);
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null);

  const [newProduct, setNewProduct] = useState({
    name: '',
    weight: '',
    price: '',
    category_id: '',
    status: 'Regular',
    img: ''
  });

  const [newCategory, setNewCategory] = useState({
    name: '',
    title: ''
  });

  useEffect(() => {
    const isAdmin = sessionStorage.getItem('isAdminAuthenticated');
    if (!isAdmin) {
      navigate('/admin/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (categories.length > 0 && !newProduct.category_id && !isEditing) {
      setNewProduct(prev => ({ ...prev, category_id: categories[0].id }));
    }
  }, [categories, newProduct.category_id, isEditing]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showNotification = (type, message) => {
    setNotification({ type, message });
  };

  const handleLogout = () => {
    sessionStorage.removeItem('isAdminAuthenticated');
    navigate('/admin/login');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleCategoryInputChange = (e) => {
    const { name, value } = e.target;
    setNewCategory({ ...newCategory, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct({ ...newProduct, img: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = (product) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsEditing(true);
    setEditId(product.id);
    setNewProduct({
      name: product.name,
      weight: product.weight || '',
      price: product.price,
      category_id: product.category_id,
      status: product.status || 'Regular',
      img: product.img
    });
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditId(null);
    setNewProduct({
      name: '',
      weight: '',
      price: '',
      category_id: categories[0]?.id || '',
      status: 'Regular',
      img: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.category_id) return;

    setSaving(true);
    try {
      if (isEditing) {
        const result = await updateProduct({ ...newProduct, id: editId });
        if (result.success) showNotification('success', 'Product updated successfully!');
        else showNotification('error', result.error);
      } else {
        const result = await addProduct(newProduct);
        if (result.success) showNotification('success', 'Product added successfully!');
        else showNotification('error', result.error);
      }
      resetForm();
    } catch (err) {
      showNotification('error', 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.name || !newCategory.title) return;
    
    setSaving(true);
    const result = await addCategory(newCategory);
    if (result.success) {
      showNotification('success', 'Category added successfully!');
      setNewCategory({ name: '', title: '' });
    } else {
      showNotification('error', result.error);
    }
    setSaving(false);
  };

  const handleDeleteCategory = async (id, name) => {
    if (!window.confirm(`Delete category "${name}"? This might fail if products are linked.`)) return;
    
    const result = await deleteCategory(id);
    if (result.success) {
      showNotification('success', 'Category deleted.');
    } else {
      showNotification('error', result.error);
    }
  };

  const handleDeleteProduct = async (product) => {
    if (!window.confirm(`Delete "${product.name}"?`)) return;
    const result = await deleteProduct(product.id);
    if (result.success) showNotification('success', 'Product deleted.');
    else showNotification('error', result.error);
  };

  const loading = productsLoading || categoriesLoading;

  return (
    <div className="admin-dashboard">
      <div className="dashboard-container">
        <header className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button 
              onClick={() => { refreshProducts(); refreshCategories(); }} 
              className="btn-logout" 
              style={{ background: '#334155' }}
            >
              <RefreshCw size={18} /> Refresh
            </button>
            <button onClick={handleLogout} className="btn-logout">
              <LogOut size={18} /> Logout
            </button>
          </div>
        </header>

        {notification && (
          <div className={`notification notification-${notification.type}`}>
            {notification.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            <span>{notification.message}</span>
            <button onClick={() => setNotification(null)} className="notification-close"><X size={14} /></button>
          </div>
        )}

        <div className="dashboard-grid">
          <div className="admin-card">
            <h2><Package size={22} /> Manage Products ({products.length})</h2>
            {loading ? (
              <div className="loading-container"><Loader size={32} className="spinner" /><p>Loading products...</p></div>
            ) : (
              <div className="products-table-container">
                <table className="products-table">
                  <thead>
                    <tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td><img src={product.img || 'https://via.placeholder.com/40'} alt="" className="product-row-img" /></td>
                        <td>{product.name}</td>
                        <td>{product.category?.title}</td>
                        <td>{product.price}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button className="btn-edit" onClick={() => handleEdit(product)}><Edit2 size={16} /></button>
                            <button className="btn-delete" onClick={() => handleDeleteProduct(product)}><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="sidebar-grid" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="admin-card">
              <h2>{isEditing ? <Edit2 size={22} /> : <PlusCircle size={22} />}{isEditing ? ' Edit Product' : ' Add Product'}</h2>
              <form className="product-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Name</label>
                  <input type="text" name="name" value={newProduct.name} onChange={handleInputChange} required />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Category</label>
                    <select name="category_id" value={newProduct.category_id} onChange={handleInputChange} required>
                      <option value="">Select Category</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select name="status" value={newProduct.status} onChange={handleInputChange}>
                      <option value="Regular">Regular</option>
                      <option value="Hot Sale">Hot Sale</option>
                      <option value="Stock Out">Stock Out</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Weight</label>
                    <input type="text" name="weight" value={newProduct.weight} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label>Price</label>
                    <input type="text" name="price" value={newProduct.price} onChange={handleInputChange} required />
                  </div>
                </div>
                <div className="form-group">
                  <label>Image</label>
                  <input type="file" onChange={handleImageUpload} style={{ marginBottom: '10px' }} />
                  <input type="text" name="img" placeholder="Or Image URL" value={newProduct.img} onChange={handleInputChange} />
                </div>
                <button type="submit" className="btn-add" disabled={saving}>{saving ? <Loader size={16} className="spinner" /> : (isEditing ? 'Update' : 'Add')}</button>
              </form>
            </div>

            <div className="admin-card">
              <h2><Tag size={22} /> Categories</h2>
              <form onSubmit={handleAddCategory} style={{ marginBottom: '20px' }}>
                <div className="form-group" style={{ marginBottom: '10px' }}>
                  <label>Type (e.g. Vegetable)</label>
                  <input type="text" name="name" value={newCategory.name} onChange={handleCategoryInputChange} required />
                </div>
                <div className="form-group" style={{ marginBottom: '10px' }}>
                  <label>Display Title (e.g. Fresh Vegetables)</label>
                  <input type="text" name="title" value={newCategory.title} onChange={handleCategoryInputChange} required />
                </div>
                <button type="submit" className="btn-add" style={{ background: '#0f172a' }}>Add Category</button>
              </form>
              <div className="category-list">
                {categories.map(c => (
                  <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                    <span>{c.title} ({c.name})</span>
                    <button onClick={() => handleDeleteCategory(c.id, c.title)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={14} /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
