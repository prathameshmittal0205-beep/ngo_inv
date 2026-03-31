import React, { useState } from 'react';
import { login } from '../api';
import { useNavigate } from 'react-router-dom';
import { Lock, User, ShieldCheck } from 'lucide-react';

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await login(form);
      // Save the token and user info
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('username', res.data.username);
      
      window.location.href = "/"; // Force refresh to update axios headers
    } catch (err) {
      setError("Invalid Username or Password");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f8fafc]">
      <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl w-full max-w-md border border-slate-100">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
            <ShieldCheck size={32} />
          </div>
        </div>
        
        <h2 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tighter text-center">NGO Engine</h2>
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mb-10 text-center text-center">Secure Authentication Required</p>

        {error && <p className="bg-red-50 text-red-500 p-4 rounded-2xl text-xs font-bold mb-6 text-center">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
              type="text" placeholder="Username" 
              className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent rounded-2xl font-bold text-sm outline-none focus:border-blue-500 transition-all"
              onChange={e => setForm({...form, username: e.target.value})} 
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
              type="password" placeholder="Password" 
              className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent rounded-2xl font-bold text-sm outline-none focus:border-blue-500 transition-all"
              onChange={e => setForm({...form, password: e.target.value})} 
              required
            />
          </div>
          <button className="w-full bg-[#0f172a] text-white p-6 rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all mt-6">
            Authorize Session
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;