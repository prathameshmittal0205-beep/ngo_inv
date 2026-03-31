import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, HandHeart, Package, 
  ClipboardList, BarChart3, Users, LogOut, 
  User as UserIcon, ShieldCheck, Activity 
} from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  
  // Get user info stored during login
  const username = localStorage.getItem('username') || 'User';
  const role = localStorage.getItem('role') || 'volunteer';

  const handleLogout = () => {
    localStorage.clear(); // Wipe the token and session data
    window.location.href = '/login'; // Force full refresh to clear axios state
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Donations', path: '/donations', icon: <HandHeart size={20} /> },
    { name: 'Resources', path: '/resources', icon: <Package size={20} /> },
    { name: 'Requests', path: '/requests', icon: <ClipboardList size={20} /> },
    { name: 'Donors', path: '/donors', icon: <Users size={20} /> },
    { name: 'Analytics', path: '/analytics', icon: <BarChart3 size={20} /> },
  ];

  return (
    <div className="w-64 bg-[#0f172a] text-white h-screen fixed left-0 top-0 flex flex-col p-6 shadow-2xl z-50">
      {/* BRANDING */}
      <div className="mb-12 px-2">
        <h1 className="text-2xl font-black tracking-tighter uppercase italic flex items-center gap-2">
          <Activity className="text-blue-500" /> NGO ENGINE
        </h1>
        <div className="flex items-center gap-2 mt-3">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">System Authenticated</span>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 p-4 rounded-2xl transition-all font-bold text-xs uppercase tracking-widest ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* USER PROFILE & LOGOUT */}
      <div className="mt-auto pt-6 border-t border-slate-800/50">
        <div className="flex items-center gap-3 mb-6 px-2">
          <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-blue-400 border border-slate-700">
            <UserIcon size={18} />
          </div>
          <div className="overflow-hidden">
            <p className="text-[11px] font-black uppercase tracking-tight truncate">{username}</p>
            <p className="text-[9px] text-slate-500 font-bold uppercase flex items-center gap-1">
              <ShieldCheck size={10} className="text-emerald-500" /> {role}
            </p>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-4 rounded-2xl text-red-400 hover:bg-red-500/10 hover:text-red-500 transition-all font-black uppercase text-[10px] tracking-[0.15em]"
        >
          <LogOut size={18} /> Logout Session
        </button>
      </div>
    </div>
  );
};

export default Sidebar;