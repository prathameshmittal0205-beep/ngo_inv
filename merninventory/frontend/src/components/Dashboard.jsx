import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import axiosInstance from '../api/axiosInstance';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [totalRequests, setTotalRequests] = useState(0);
  const [totalProviders, setTotalProviders] = useState(0);
  const [totalResources, setTotalResources] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  
  const [recentRequests, setRecentRequests] = useState([]);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [requestsRes, providersRes, resourcesRes] = await Promise.all([
        axiosInstance.get('/api/requests'),
        axiosInstance.get('/api/providers'),
        axiosInstance.get('/api/resources')
      ]);

      const requests = requestsRes.data;
      const providers = providersRes.data;
      const resources = resourcesRes.data;

      // 1. Metric Computations
      setTotalRequests(requests.length);
      setTotalProviders(providers.length);
      setTotalResources(resources.length);

      const lowStockResources = resources.filter(r => r.quantity < 10);
      setLowStockCount(lowStockResources.length);

      // 2. Pending Requests List (show up to 5 most recent requests)
      // Reversing to show latest first if backend appends to bottom
      setRecentRequests([...requests].reverse().slice(0, 5));

      // 3. Chart Data: Resource Stock Levels (Top 10 highest stock items)
      const sortedResources = [...resources].sort((a, b) => b.quantity - a.quantity).slice(0, 10);
      
      setChartData({
        labels: sortedResources.map(r => r.name),
        datasets: [
          {
            label: 'Resource Quantity in Stock',
            data: sortedResources.map(r => r.quantity),
            backgroundColor: '#2E7D32', // var(--color-primary)
            hoverBackgroundColor: '#1B5E20', // var(--color-primary-hover)
            borderRadius: 4,
          },
        ],
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#E5E7EB'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <div className="container-fluid py-4">
      
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="app-title mb-1">Dashboard</h1>
          <p className="text-muted-custom mb-0">Overview of community resources and activity.</p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="row g-4 mb-5">
        <div className="col-12 col-md-6 col-lg-3 dashboard-card-wrapper">
          <div className="dashboard-card card-primary">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <p className="text-muted-custom mb-1">Total Resources</p>
                <h2 className="section-title mb-0" style={{ fontSize: '2rem' }}>{totalResources}</h2>
              </div>
              <i className="bi bi-box-seam card-icon text-success"></i>
            </div>
            <div className="mt-auto">
              <span className="badge-status badge-success">Active</span>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-3 dashboard-card-wrapper">
          <div className="dashboard-card card-warning">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <p className="text-muted-custom mb-1">Pending Requests</p>
                <h2 className="section-title mb-0" style={{ fontSize: '2rem' }}>{totalRequests}</h2>
              </div>
              <i className="bi bi-clock-history card-icon text-warning"></i>
            </div>
            <div className="mt-auto">
              <span className="badge-status badge-warning">Action Needed</span>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-3 dashboard-card-wrapper">
          <div className="dashboard-card card-secondary">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <p className="text-muted-custom mb-1">Active Providers</p>
                <h2 className="section-title mb-0" style={{ fontSize: '2rem' }}>{totalProviders}</h2>
              </div>
              <i className="bi bi-truck card-icon text-primary"></i>
            </div>
            <div className="mt-auto">
              <span className="badge-status badge-success">Good Standing</span>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-3 dashboard-card-wrapper">
          <div className="dashboard-card card-danger">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <p className="text-muted-custom mb-1">Low Stock Alerts</p>
                <h2 className="section-title mb-0" style={{ fontSize: '2rem' }}>{lowStockCount}</h2>
              </div>
              <i className="bi bi-exclamation-triangle card-icon text-danger"></i>
            </div>
            <div className="mt-auto">
              {lowStockCount > 0 ? (
                <span className="badge-status badge-danger">Critical</span>
              ) : (
                <span className="badge-status badge-success">Healthy</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="row g-4">
        
        {/* Chart Section */}
        <div className="col-12 col-lg-7">
          <div className="dashboard-card" style={{ animationDelay: '0.5s' }}>
            <h2 className="section-title mb-4">Resource Stock Levels</h2>
            <div style={{ height: '300px' }}>
              <Bar data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Pending Requests Table */}
        <div className="col-12 col-lg-5">
          <div className="dashboard-card" style={{ animationDelay: '0.6s' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="section-title mb-0">Pending Requests</h2>
            </div>
            <div className="table-responsive custom-table">
              <table className="table mb-0">
                <thead>
                  <tr>
                    <th>Customer Name</th>
                    <th>Product</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRequests.length > 0 ? (
                    recentRequests.map(req => (
                      <tr key={req._id}>
                        <td><strong>{req.customerName}</strong></td>
                        <td>{req.productName} (x{req.quantity})</td>
                        <td>
                          <span className="badge-status badge-warning">Pending</span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center text-muted py-4">
                        No pending requests.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
      </div>

    </div>
  );
};

export default Dashboard;