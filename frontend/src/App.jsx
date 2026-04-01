import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Search, Bell, UserCircle } from 'lucide-react';

// --- IMPORT COMPONENTS & PAGES ---
import Sidebar from './components/Sidebar';
import DashboardContent from './pages/Dashboard'; 
import Resources from './pages/Resources';
import Donors from './pages/Donors';
import Donations from './pages/Donations';
import Requests from './pages/Requests';
import Analytics from './pages/Analytics';
import Login from './pages/Login';

// --- 🛡️ PROTECTED ROUTE GATEKEEPER ---
const ProtectedRoute = ({ children }) => {
  // We check for the token stored during login
  const token = localStorage.getItem('token');
  
  if (!token) {
    // If no token exists, force user to login page
    return <Navigate to="/login" replace />;
  }
  
  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Sidebar stays fixed on the left */}
      <Sidebar />
      
      <div className="flex-1 ml-64 flex flex-col">
        {/* Persistent Header for all protected pages */}
        <header className="h-20 bg-white/70 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-10 sticky top-0 z-10">
          <div className="flex items-center bg-slate-100 px-5 py-2.5 rounded-2xl w-96">
            <Search size={16} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Search NGO Database..." 
              className="bg-transparent border-none outline-none ml-3 text-xs font-bold w-full text-slate-700" 
            />
          </div>
          
          <div className="flex items-center gap-6 pr-4">
            <Bell size={20} className="text-slate-400" />
            <div className="flex items-center gap-2">
              <div className="text-right">
                <p className="text-[10px] font-black uppercase text-slate-900 leading-none">System Admin</p>
                <p className="text-[8px] font-bold uppercase text-green-500 tracking-tighter">Authenticated</p>
              </div>
              <UserCircle size={32} className="text-slate-200" />
            </div>
          </div>
        </header>

        {/* This is where Dashboard, Resources, etc. will render */}
        {children}
      </div>
    </div>
  );
};

function App() {
  return (
    <Router 
      future={{ 
        v7_startTransition: true, 
        v7_relativeSplatPath: true 
      }}
    >
      <Routes>
        {/* PUBLIC ROUTE: Accessible without a token */}
        <Route path="/login" element={<Login />} />

        {/* PROTECTED ROUTES: All wrapped in the gatekeeper */}
        <Route path="/" element={
          <ProtectedRoute>
            <DashboardContent />
          </ProtectedRoute>
        } />
        
        <Route path="/resources" element={
          <ProtectedRoute>
            <Resources />
          </ProtectedRoute>
        } />

        <Route path="/donors" element={
          <ProtectedRoute>
            <Donors />
          </ProtectedRoute>
        } />

        <Route path="/donations" element={
          <ProtectedRoute>
            <Donations />
          </ProtectedRoute>
        } />

        <Route path="/requests" element={
          <ProtectedRoute>
            <Requests />
          </ProtectedRoute>
        } />

        <Route path="/analytics" element={
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        } />

        {/* CATCH-ALL: Redirect any typos or old links to the Dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;