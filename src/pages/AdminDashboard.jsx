import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductContext } from '../context/ProductContext';
import { PlusCircle, Trash2, Edit2, Package, LogOut, X, Upload, RefreshCw, Loader, AlertCircle, CheckCircle } from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { products, loading, error, addProduct, deleteProduct, updateProduct, refreshProducts } = useContext(ProductContext);
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null);

  const [newProduct, setNewProduct] = useState({
    name: '',
    weight: '',
    price: '',
    type: 'Vegetable',
    status: 'Regular',
    img: ''
  });

  useEffect(() => {
    const isAdmin = sessionStorage.getItem('isAdminAuthenticated');
    if (!isAdmin) {
      navigate('/admin/login');
    }
  }, [navigate]);

  // Auto-dismiss notifications after 4 seconds
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
      type: product.type,
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
      type: 'Vegetable',
      status: 'Regular',
      img: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;

    setSaving(true);
    try {
      if (isEditing) {
        const result = await updateProduct({ ...newProduct, id: editId });
        if (result.success) {
          showNotification('success', 'Product updated & saved to database!');
        } else {
          showNotification('warning', 'Product updated locally, but failed to save to database. It may not persist.');
        }
      } else {
        const result = await addProduct(newProduct);
        if (result.success) {
          showNotification('success', 'Product added & saved to database!');
        } else {
          showNotification('warning', 'Product added locally, but failed to save to database. It may not persist.');
        }
      }
      resetForm();
    } catch (err) {
      showNotification('error', 'Something went wrong: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.name}"?`)) return;

    const result = await deleteProduct(product.id);
    if (result.success) {
      showNotification('success', `"${product.name}" deleted from database.`);
    } else {
      showNotification('warning', 'Deleted locally, but database sync failed.');
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-container">
        <header className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button 
              onClick={refreshProducts} 
              className="btn-logout" 
              style={{ background: '#334155' }}
              title="Refresh from database"
            >
              <RefreshCw size={18} /> Refresh
            </button>
            <button onClick={handleLogout} className="btn-logout">
              <LogOut size={18} /> Logout
            </button>
          </div>
        </header>

        {/* Notification Banner */}
        {notification && (
          <div className={`notification notification-${notification.type}`}>
            {notification.type === 'success' && <CheckCircle size={18} />}
            {notification.type === 'error' && <AlertCircle size={18} />}
            {notification.type === 'warning' && <AlertCircle size={18} />}
            <span>{notification.message}</span>
            <button onClick={() => setNotification(null)} className="notification-close">
              <X size={14} />
            </button>
          </div>
        )}

        {/* Database Connection Status */}
        {error && (
          <div className="notification notification-warning" style={{ marginBottom: '20px' }}>
            <AlertCircle size={18} />
            <span>Database connection failed — showing cached data. Changes may not persist. Error: {error}</span>
          </div>
        )}

        <div className="dashboard-grid">
          {/* Product Management Section */}
          <div className="admin-card">
            <h2><Package size={22} /> Manage Products ({products.length})</h2>
            
            {loading ? (
              <div className="loading-container">
                <Loader size={32} className="spinner" />
                <p>Loading products from database...</p>
              </div>
            ) : (
              <div className="products-table-container">
                <table className="products-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Weight</th>
                      <th>Status</th>
                      <th>Type</th>
                      <th>Price</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td>
                          <img 
                            src={product.img || 'https://via.placeholder.com/40'} 
                            alt={product.name} 
                            className="product-row-img"
                          />
                        </td>
                        <td>{product.name}</td>
                        <td>{product.weight}</td>
                        <td>
                          <span className={`status-pill status-${(product.status || 'Regular').toLowerCase().replace(' ', '')}`}>
                            {product.status || 'Regular'}
                          </span>
                        </td>
                        <td>{product.type}</td>
                        <td>{product.price}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button 
                              className="btn-edit"
                              onClick={() => handleEdit(product)}
                              title="Edit Product"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button 
                              className="btn-delete"
                              onClick={() => handleDelete(product)}
                              title="Delete Product"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Add Product Sidebar */}
          <div className="admin-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
              <h2 style={{ margin: 0 }}>
                {isEditing ? <Edit2 size={22} /> : <PlusCircle size={22} />}
                {isEditing ? ' Edit Product' : ' Add New Product'}
              </h2>
              {isEditing && (
                <button onClick={resetForm} className="btn-cancel" title="Cancel Edit">
                  <X size={18} />
                </button>
              )}
            </div>
            
            <form className="product-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Product Name</label>
                <input 
                  type="text" 
                  name="name"
                  placeholder="e.g. Tomato"
                  value={newProduct.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Weight (Unit)</label>
                <input 
                  type="text" 
                  name="weight"
                  placeholder="e.g. 500g or 1kg"
                  value={newProduct.weight}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select 
                    name="type" 
                    value={newProduct.type}
                    onChange={handleInputChange}
                  >
                    <option value="Vegetable">Vegetable</option>
                    <option value="Herb">Herb</option>
                    <option value="Fruit">Fruit</option>
                    <option value="Fish">Fish</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select 
                    name="status" 
                    value={newProduct.status}
                    onChange={handleInputChange}
                  >
                    <option value="Regular">Regular</option>
                    <option value="Hot Sale">Hot Sale</option>
                    <option value="Stock Out">Stock Out</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Price</label>
                <input 
                  type="text" 
                  name="price"
                  placeholder="e.g. 50 ৳"
                  value={newProduct.price}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Product Image</label>
                <div className="image-upload-container">
                  {newProduct.img ? (
                    <div className="image-preview">
                      <img src={newProduct.img} alt="Preview" />
                      <button type="button" onClick={() => setNewProduct({...newProduct, img: ''})} className="remove-img">
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <label className="upload-placeholder">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                      />
                      <Upload size={24} />
                      <span>Click to upload image</span>
                    </label>
                  )}
                </div>
                <input 
                  type="text" 
                  name="img"
                  placeholder="Or paste image URL"
                  value={newProduct.img}
                  onChange={handleInputChange}
                  style={{ marginTop: '10px' }}
                />
              </div>

              <button 
                type="submit" 
                className={isEditing ? "btn-add btn-update" : "btn-add"}
                disabled={saving}
              >
                {saving ? (
                  <><Loader size={16} className="spinner" /> Saving...</>
                ) : (
                  isEditing ? 'Update Product' : 'Add Product'
                )}
              </button>
            </form>

            {/* Database status info */}
            <div className="db-status-info">
              <CheckCircle size={14} />
              <span>Products are saved directly to the database. Changes persist automatically.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
