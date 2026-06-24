import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Sidebar = () => {
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isSuppliersOpen, setIsSuppliersOpen] = useState(false); 
  const [isInventoryOpen, setIsInventoryOpen] = useState(false); 
  const [isSalesOpen, setIsSalesOpen]  = useState(false); 
  const [isEmployeesOpen,setIsEmployeesOpen] =  useState(false); 

  return (
    <div className="bg-dark text-white p-3" style={{ width: '250px' }}>
      <h5 className="text-center mb-4">Community Menu</h5>

      <ul className="nav flex-column">

        <li className="nav-item mb-3">
          <Link to="/dashboard" className="nav-link text-white">
            <i className="bi bi-speedometer2 me-2"></i> Dashboard
          </Link>
        </li>

        <li className="nav-item mb-3">
          <button className="nav-link text-white bg-dark border-0 w-100 text-start"
            onClick={() => setIsOrdersOpen(!isOrdersOpen)}>
            <i className="bi bi-receipt me-2"></i> Resource Requests
          </button>

          {isOrdersOpen && (
            <ul className="nav flex-column ms-3">
              <li><Link to="/dashboard/requests/add" className="nav-link text-white">Add Request</Link></li>
              <li><Link to="/dashboard/requests/view" className="nav-link text-white">View Requests</Link></li>
              <li><Link to="/dashboard/requests/manage" className="nav-link text-white">Manage Requests</Link></li>
            </ul>
          )}
        </li>

        <li className="nav-item mb-3">
          <button className="nav-link text-white bg-dark border-0 w-100 text-start"
            onClick={() => setIsSuppliersOpen(!isSuppliersOpen)}>
            <i className="bi bi-truck me-2"></i> Resource Providers
          </button>

          {isSuppliersOpen && (
            <ul className="nav flex-column ms-3">
              <li><Link to="/dashboard/providers/add" className="nav-link text-white">Add Provider</Link></li>
              <li><Link to="/dashboard/providers/manage" className="nav-link text-white">Manage Providers</Link></li>
            </ul>
          )}
        </li>

        <li className="nav-item mb-3">
          <button className="nav-link text-white bg-dark border-0 w-100 text-start"
            onClick={() => setIsInventoryOpen(!isInventoryOpen)}>
            <i className="bi bi-boxes me-2"></i> Community Resources
          </button>

          {isInventoryOpen && (
            <ul className="nav flex-column ms-3">
              <li><Link to="/dashboard/resources/add" className="nav-link text-white">Add Resource</Link></li>
              <li><Link to="/dashboard/resources/manage" className="nav-link text-white">Manage Resources</Link></li>
            </ul>
          )}
        </li>

        <li className="nav-item mb-3">
          <Link to="/dashboard/settings" className="nav-link text-white">
            <i className="bi bi-gear me-2"></i> Settings
          </Link>
        </li>

      </ul>
    </div>
  );
};

export default Sidebar;