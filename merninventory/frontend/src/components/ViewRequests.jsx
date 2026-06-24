import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axiosInstance from '../api/axiosInstance';

const ViewRequests = () => {
  // State to hold requests
  const [requests, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch requests data from backend
    const fetchOrders = async () => {
      try {
        const response = await axiosInstance.get('/api/requests');
        setOrders(response.data);
        setFilteredOrders(response.data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchOrders();
  }, []);

  // Function to handle search/filtering
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = requests.filter(request =>
      request.customerName.toLowerCase().includes(value) ||
      request.productName.toLowerCase().includes(value)
    );

    setFilteredOrders(filtered);
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">View Requests</h2>
      
      {/* Search Bar */}
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by Customer or Product"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {/* Requests Table */}
      <table className="table table-striped">
        <thead className="thead-dark">
          <tr>
            <th scope="col">Customer Name</th>
            <th scope="col">Product Name</th>
            <th scope="col">Quantity</th>
            <th scope="col">Price ($)</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.length > 0 ? (
            filteredOrders.map(request => (
              <tr key={request._id}> {/* Use _id for MongoDB documents */}
                <td>{request.customerName}</td>
                <td>{request.productName}</td>
                <td>{request.quantity}</td>
                <td>{request.price}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">No requests found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ViewRequests;
