// components/EditProvider.js
import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const EditProvider = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [provider, setSupplier] = useState({
    supplierName: '',
    phone: '',
    email: '',
    address: '',
    supplyProducts: '',
    paymentTerms: ''
  });

  useEffect(() => {
    if (id) {
      const fetchSupplier = async () => {
        try {
          const response = await axiosInstance.get(`/api/providers/${id}`);
          setSupplier(response.data);
        } catch (error) {
          console.error('Error fetching provider:', error);
        }
      };
      fetchSupplier();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSupplier({ ...provider, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await axiosInstance.put(`/api/providers/${id}`, provider);
      } else {
        await axiosInstance.post('/api/providers', provider);
      }
      navigate('/dashboard/providers/manage'); // Redirect to ManageProviders after successful update
    } catch (error) {
      console.error('Error saving provider:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>{id ? 'Edit Provider' : 'Add New Provider'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Provider Name</label>
          <input
            type="text"
            className="form-control"
            name="supplierName"
            value={provider.supplierName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Phone</label>
          <input
            type="text"
            className="form-control"
            name="phone"
            value={provider.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={provider.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Address</label>
          <input
            type="text"
            className="form-control"
            name="address"
            value={provider.address}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Supply Products</label>
          <input
            type="text"
            className="form-control"
            name="supplyProducts"
            value={provider.supplyProducts}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Payment Terms</label>
          <input
            type="text"
            className="form-control"
            name="paymentTerms"
            value={provider.paymentTerms}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          {id ? 'Update Provider' : 'Add Provider'}
        </button>
      </form>
    </div>
  );
};

export default EditProvider;
