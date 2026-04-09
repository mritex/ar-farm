import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductContext } from '../context/ProductContext';
import { PlusCircle, Trash2, Edit2, Package, LogOut, X, Upload } from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { products, addProduct, deleteProduct, updateProduct } = useContext(ProductContext);
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newProduct.name && newProduct.price) {
      if (isEditing) {
        updateProduct({ ...newProduct, id: editId });
        alert('Product updated successfully!');
      } else {
        addProduct(newProduct);
        alert('Product added successfully!');
      }
      resetForm();
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-container">
        <header className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <button onClick={handleLogout} className="btn-logout">
            <LogOut size={18} /> Logout
          </button>
        </header>

        <div className="dashboard-grid">
          {/* Product Management Section */}
          <div className="admin-card">
            <h2><Package size={22} /> Manage Products ({products.length})</h2>
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
                            onClick={() => {
                              if (window.confirm('Delete this product?')) {
                                deleteProduct(product.id);
                              }
                            }}
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

              <button type="submit" className={isEditing ? "btn-add btn-update" : "btn-add"}>
                {isEditing ? 'Update Product' : 'Add Product'}
              </button>
            </form>

            <hr style={{ margin: '30px 0', border: 'none', borderTop: '1px solid #e2e8f0' }} />

            <h2><Package size={22} /> Save Changes (Sync)</h2>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '15px' }}>
              Since we are not using a database, you must copy the JSON below and paste it into <code>src/data/products.json</code> to make your changes permanent for everyone.
            </p>
            <button 
              className="btn-add" 
              style={{ background: '#334155' }}
              onClick={() => {
                navigator.clipboard.writeText(JSON.stringify(products, null, 2));
                alert('JSON copied to clipboard! Paste it into src/data/products.json');
              }}
            >
              Update the Shop page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
