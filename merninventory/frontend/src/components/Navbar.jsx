import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div className="container-fluid">

        {/* Title */}
        <a className="navbar-brand" href="/dashboard">
          Community Resource Management System
        </a>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto">

            <li className="nav-item">
              <a className="nav-link text-light" href="/dashboard">Dashboard</a>
            </li>

            <li className="nav-item">
              <button className="btn btn-link nav-link text-light" onClick={handleLogout}>
                Logout
              </button>
            </li>

          </ul>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;