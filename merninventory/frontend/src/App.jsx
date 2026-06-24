import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import AddRequest from './components/AddRequest'; // Resource Request
import Layout from './components/Layout';
import ViewRequests from './components/ViewRequests';
import ManageRequests from './components/ManageRequests';
import AddProvider from './components/AddProvider'; // Resource Provider
import ManageProviders from './components/ManageProviders';
import EditProvider from './components/EditProvider';
import AddResource from './components/AddResource'; // Resource
import ManageResources from './components/ManageResources';
import AddSalesRecord from './components/AddSalesRecord'; // Usage Record
import ManageSales from './components/ManageSales';
import GenerateReport from './components/GenerateReport';
import AddEmployee from './components/AddEmployee';
import ManageEmployee from './components/ManageEmployee';
import Settings from './components/Settings';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<Layout />}>

          <Route index element={<Dashboard />} />

          {/* Requests → Resource Requests */}
          <Route path="requests/add" element={<AddRequest />} />
          <Route path="requests/view" element={<ViewRequests />} />
          <Route path="requests/manage" element={<ManageRequests />} />

          {/* Providers → Resource Providers */}
          <Route path="providers/add" element={<AddProvider />} />
          <Route path="providers/manage" element={<ManageProviders />} />
          <Route path="providers/edit/:id" element={<EditProvider />} />

          {/* Inventory → Community Resources */}
          <Route path="resources/add" element={<AddResource />} />
          <Route path="resources/manage" element={<ManageResources />} />

          {/* Sales → Resource Usage */}
          <Route path="sales/add" element={<AddSalesRecord />} />
          <Route path="sales/manage" element={<ManageSales />}/>
          <Route path="sales/report" element={<GenerateReport />}/>

          {/* Employees */}
          <Route path="Employeess/add" element={<AddEmployee/>}/>
          <Route path="Employees/manage" element={<ManageEmployee/>}/>

          {/* Settings */}
          <Route path="settings" element={<Settings/>}/>

        </Route>
      </Routes>
    </Router>
  );
}

export default App;