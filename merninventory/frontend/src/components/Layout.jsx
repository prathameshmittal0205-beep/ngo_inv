import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div>
      <Navbar />

      <div style={{ display: 'flex' }}>

        {/* Sidebar FULL HEIGHT */}
        <div
          style={{
            width: '250px',
            height: '100vh',
            position: 'fixed',
            top: 0,
            left: 0,
            backgroundColor: '#212529',
            paddingTop: '56px' // 👈 THIS IS KEY
          }}
        >
          <Sidebar />
        </div>

        {/* Main Content */}
        <div
          style={{
            marginLeft: '250px',
            marginTop: '56px',
            padding: '20px',
            width: '100%'
          }}
        >
          <Outlet />
        </div>

      </div>
    </div>
  );
};

export default Layout;