import React, { useState } from 'react';
import '../css/AddRequest.css';
import axiosInstance from '../api/axiosInstance';

const AddRequest = () => {
  const [request, setOrder] = useState({
    customerName: '',
    productName: '',
    quantity: '',
    price: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axiosInstance.post('/api/requests', request);

      if (response.status === 201 || response.status === 200) {
        console.log('Request saved:', response.data);
        // Optionally reset the form after submission
        setOrder({ customerName: '', productName: '', quantity: '', price: '' });
      } else {
        console.error('Failed to save request');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h3>Add Request</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Customer Name</label>
          <input
            type="text"
            className="form-control"
            value={request.customerName}
            onChange={(e) => setOrder({ ...request, customerName: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Product Name</label>
          <input
            type="text"
            className="form-control"
            value={request.productName}
            onChange={(e) => setOrder({ ...request, productName: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Quantity</label>
          <input
            type="number"
            className="form-control"
            value={request.quantity}
            onChange={(e) => setOrder({ ...request, quantity: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Price</label>
          <input
            type="number"
            className="form-control"
            value={request.price}
            onChange={(e) => setOrder({ ...request, price: e.target.value })}
          />
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default AddRequest;
