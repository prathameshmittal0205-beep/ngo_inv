import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axiosInstance from '../api/axiosInstance';

const ManageRequests = () => {
  const [requests, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalShow, setModalShow] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatedOrder, setUpdatedOrder] = useState({
    customerName: '',
    productName: '',
    quantity: '',
    price: '',
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axiosInstance.get('/api/requests');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  const handleDelete = async (orderId) => {
    try {
      await axiosInstance.delete(`/api/requests/${orderId}`);
      fetchOrders();
    } catch (error) {
      console.error('Error deleting request:', error);
    }
  };

  const handleUpdate = async (orderId) => {
    try {
      await axiosInstance.put(`/api/requests/${orderId}`, updatedOrder);
      fetchOrders();
      setModalShow(false);
    } catch (error) {
      console.error('Error updating request:', error);
    }
  };

  const handleEditClick = (request) => {
    setSelectedOrder(request);
    setUpdatedOrder({
      customerName: request.customerName,
      productName: request.productName,
      quantity: request.quantity,
      price: request.price,
    });
    setModalShow(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedOrder(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredOrders = requests.filter(request =>
    request.customerName.toLowerCase().includes(searchTerm) ||
    request.productName.toLowerCase().includes(searchTerm)
  );

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Manage Requests</h2>
      
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by Customer or Product"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <table className="table table-striped">
        <thead className="thead-dark">
          <tr>
            <th scope="col">Customer Name</th>
            <th scope="col">Product Name</th>
            <th scope="col">Quantity</th>
            <th scope="col">Price ($)</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.length > 0 ? (
            filteredOrders.map(request => (
              <tr key={request._id}>
                <td>{request.customerName}</td>
                <td>{request.productName}</td>
                <td>{request.quantity}</td>
                <td>{request.price}</td>
                <td>
                  <button
                    className="btn btn-warning"
                    onClick={() => handleEditClick(request)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger ml-2"
                    onClick={() => handleDelete(request._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">No requests found</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Update Modal */}
      <div className={`modal ${modalShow ? 'show' : ''}`} tabIndex="-1" role="dialog" style={{ display: modalShow ? 'block' : 'none' }}>
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Update Request</h5>
              <button type="button" className="close" aria-label="Close" onClick={() => setModalShow(false)}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form>
                <div className="form-group">
                  <label>Customer Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="customerName"
                    value={updatedOrder.customerName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Product Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="productName"
                    value={updatedOrder.productName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Quantity</label>
                  <input
                    type="number"
                    className="form-control"
                    name="quantity"
                    value={updatedOrder.quantity}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Price</label>
                  <input
                    type="number"
                    className="form-control"
                    name="price"
                    value={updatedOrder.price}
                    onChange={handleInputChange}
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setModalShow(false)}>Close</button>
              <button type="button" className="btn btn-primary" onClick={() => handleUpdate(selectedOrder._id)}>Save changes</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageRequests;
