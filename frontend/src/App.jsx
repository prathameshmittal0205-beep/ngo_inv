import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// --- IMPORT YOUR PAGES ---
import Dashboard from './pages/Dashboard';
import Donations from './pages/Donations';
import Resources from './pages/Resources';
import Requests from './pages/Requests';
import Analytics from './pages/Analytics';
import Donors from './pages/Donors';
import Login from './pages/Login'; // The file you just created
import Sidebar from './components/Sidebar';

// --- 🛡️ PROTECTED ROUTE COMPONENT ---
// This acts as the gatekeeper. No token = No access.
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }
  
  return (
    <div className="flex bg-[#f8fafc] min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64 overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* PUBLIC ROUTE */}
        <Route path="/login" element={<Login />} />

        {/* PROTECTED ROUTES */}
        {/* We wrap every private page in the ProtectedRoute component */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/donations" 
          element={
            <ProtectedRoute>
              <Donations />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/resources" 
          element={
            <ProtectedRoute>
              <Resources />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/requests" 
          element={
            <ProtectedRoute>
              <Requests />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/donors" 
          element={
            <ProtectedRoute>
              <Donors />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/analytics" 
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          } 
        />

        {/* CATCH-ALL: Redirect any unknown path to Dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;