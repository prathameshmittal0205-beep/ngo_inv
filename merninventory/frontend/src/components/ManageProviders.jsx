// components/ManageProviders.js
import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

const ManageProviders = () => {
  const [providers, setSuppliers] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await axiosInstance.get('/api/providers', {
          params: { search, filter }
        });
        setSuppliers(response.data);
      } catch (error) {
        console.error('Error fetching providers:', error.response ? error.response.data : error.message);
      }
    };

    fetchSuppliers();
  }, [search, filter]);

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/api/providers/${id}`);
      setSuppliers(providers.filter(provider => provider._id !== id));
    } catch (error) {
      console.error('Error deleting provider:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Manage Providers</h2>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Filter by products..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>
      <Link to="/dashboard/providers/add" className="btn btn-primary mb-3">Add New Provider</Link>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Provider Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Address</th>
            <th>Supply Products</th>
            <th>Payment Terms</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {providers.length > 0 ? providers.map(provider => (
            <tr key={provider._id}>
              <td>{provider.supplierName}</td>
              <td>{provider.phone}</td>
              <td>{provider.email}</td>
              <td>{provider.address}</td>
              <td>{provider.supplyProducts}</td>
              <td>{provider.paymentTerms}</td>
              <td>
                <Link to={`/dashboard/providers/edit/${provider._id}`} className="btn btn-warning me-2">Edit</Link>
                <button className="btn btn-danger" onClick={() => handleDelete(provider._id)}>Delete</button>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan="7" className="text-center">No providers found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageProviders;
