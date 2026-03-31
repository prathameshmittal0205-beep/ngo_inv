import React, { useEffect, useState } from 'react';
import { getDonors, addDonor } from '../api';
import { UserPlus, Mail, ShieldCheck, X } from 'lucide-react';

const Donors = () => {
  const [donors, setDonors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', type: 'Individual', phone: '' });

  const fetchDonors = () => getDonors().then(res => setDonors(res.data || []));
  useEffect(() => { fetchDonors(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDonor(formData);
    setShowForm(false);
    fetchDonors();
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Donor Registry</h1>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-[10px] tracking-widest shadow-xl shadow-blue-200 hover:scale-105 transition-all">
          <UserPlus size={16} /> REGISTER DONOR
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {donors.map(d => (
          <div key={d._id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-lg shadow-slate-200/50 hover:border-blue-200 transition-all">
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4 border border-slate-100">
              <ShieldCheck size={24} />
            </div>
            <h3 className="font-black text-slate-800 uppercase text-sm tracking-tight mb-1">{d.name}</h3>
            <div className="flex items-center gap-2 text-slate-400 mb-4">
              <Mail size={12} />
              <span className="text-[10px] font-bold">{d.email}</span>
            </div>
            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${d.type === 'Corporate' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
              {d.type} Contributor
            </span>
          </div>
        ))}
      </div>

      {/* REGISTRATION MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-6">
          <div className="bg-white p-10 rounded-[3rem] w-full max-w-md shadow-2xl relative border border-white">
            <button onClick={() => setShowForm(false)} className="absolute top-8 right-8 text-slate-300 hover:text-red-500 transition-colors"><X /></button>
            <h2 className="text-2xl font-black text-slate-900 mb-8 uppercase tracking-tighter">New Donor Entry</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <input type="text" placeholder="Full Name" className="w-full p-4 bg-slate-50 border-2 border-slate-50 rounded-2xl outline-blue-500 font-bold text-sm" required onChange={e => setFormData({...formData, name: e.target.value})} />
              <input type="email" placeholder="Email Address" className="w-full p-4 bg-slate-50 border-2 border-slate-50 rounded-2xl outline-blue-500 font-bold text-sm" required onChange={e => setFormData({...formData, email: e.target.value})} />
              <select className="w-full p-4 bg-slate-50 border-2 border-slate-50 rounded-2xl outline-blue-500 font-bold text-sm cursor-pointer" onChange={e => setFormData({...formData, type: e.target.value})}>
                <option>Individual</option>
                <option>Corporate</option>
              </select>
              <button className="w-full bg-slate-900 text-white p-5 rounded-[2rem] font-black uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-blue-600 transition-all">Submit to Registry</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Donors;