import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Card, Table } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import axiosInstance from '../api/axiosInstance';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalSuppliers, setTotalSuppliers] = useState(0);
  const [totalInventory, setTotalInventory] = useState(0);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [employees, setEmployees] = useState([]);
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const ordersResponse = await axiosInstance.get('/api/requests');
      setTotalOrders(ordersResponse.data.length);

      const suppliersResponse = await axiosInstance.get('/api/providers');
      setTotalSuppliers(suppliersResponse.data.length);

      const inventoryResponse = await axiosInstance.get('/api/resources');
      setTotalInventory(inventoryResponse.data.length);

      const employeesResponse = await axiosInstance.get('/api/employees');
      setTotalEmployees(employeesResponse.data.length);
      setEmployees(employeesResponse.data);

      const dummySalesData = [
        { month: 'Jan', sales: 500 },
        { month: 'Feb', sales: 700 },
        { month: 'Mar', sales: 800 },
        { month: 'Apr', sales: 600 },
        { month: 'May', sales: 900 },
        { month: 'Jun', sales: 750 },
      ];

      setSalesData(dummySalesData);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const chartData = {
    labels: salesData.map(d => d.month),
    datasets: [
      {
        label: 'Resource Usage',
        data: salesData.map(d => d.sales),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  return (
    <div className="container-fluid">

      {/* Title */}
      <h2 className="mb-4">Community Resource Dashboard</h2>

      {/* Cards */}
      <div className="row">
        <div className="col-md-3">
          <Card className="text-center mb-4">
            <Card.Body>
              <Card.Title>Total Requests</Card.Title>
              <Card.Text>{totalOrders}</Card.Text>
            </Card.Body>
          </Card>
        </div>

        <div className="col-md-3">
          <Card className="text-center mb-4">
            <Card.Body>
              <Card.Title>Total Providers</Card.Title>
              <Card.Text>{totalSuppliers}</Card.Text>
            </Card.Body>
          </Card>
        </div>

        <div className="col-md-3">
          <Card className="text-center mb-4">
            <Card.Body>
              <Card.Title>Total Resources</Card.Title>
              <Card.Text>{totalInventory}</Card.Text>
            </Card.Body>
          </Card>
        </div>

        <div className="col-md-3">
          <Card className="text-center mb-4">
            <Card.Body>
              <Card.Title>Total Members</Card.Title>
              <Card.Text>{totalEmployees}</Card.Text>
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* Table */}
      <div className="mt-4">
        <h4>Community Members</h4>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Department</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => (
              <tr key={emp._id}>
                <td>{emp.name}</td>
                <td>{emp.department}</td>
                <td>{emp.email}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Chart */}
      <div className="mt-4">
        <h4>Resource Usage</h4>
        <Bar data={chartData} />
      </div>

    </div>
  );
};

export default Dashboard;