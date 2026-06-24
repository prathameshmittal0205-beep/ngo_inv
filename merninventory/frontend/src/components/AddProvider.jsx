import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axiosInstance from '../api/axiosInstance';

const AddProvider = () => {
  // State to manage form data
  const [provider, setSupplier] = useState({
    supplierName: '',
    phone: '',
    email: '',
    address: '',
    supplyProducts: '',
    paymentTerms: '',
  });

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Sending data to the backend
      await axiosInstance.post('/api/providers', provider);
      alert('Provider added successfully');
      setSupplier({
        supplierName: '',
        phone: '',
        email: '',
        address: '',
        supplyProducts: '',
        paymentTerms: '',
      });
    } catch (error) {
      console.error('Error adding provider:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Add Provider</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Provider Name</label>
          <input
            type="text"
            className="form-control"
            value={provider.supplierName}
            onChange={(e) => setSupplier({ ...provider, supplierName: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Phone</label>
          <input
            type="tel"
            className="form-control"
            value={provider.phone}
            onChange={(e) => setSupplier({ ...provider, phone: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            value={provider.email}
            onChange={(e) => setSupplier({ ...provider, email: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Address</label>
          <input
            type="text"
            className="form-control"
            value={provider.address}
            onChange={(e) => setSupplier({ ...provider, address: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Supply Products</label>
          <input
            type="text"
            className="form-control"
            value={provider.supplyProducts}
            onChange={(e) => setSupplier({ ...provider, supplyProducts: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Payment Terms</label>
          <input
            type="text"
            className="form-control"
            value={provider.paymentTerms}
            onChange={(e) => setSupplier({ ...provider, paymentTerms: e.target.value })}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Add Provider</button>
      </form>
    </div>
  );
};

export default AddProvider;
