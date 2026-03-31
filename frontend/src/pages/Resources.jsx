import React, { useEffect, useState } from 'react';
import { getResources, deleteResource, addResource, getDonors } from '../api';
import { Trash2, PackagePlus, X, Search, Database, User, AlertCircle } from 'lucide-react';

const Resources = () => {
  const [data, setData] = useState([]);
  const [donors, setDonors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ 
    name: '', category: 'General', quantity: '', unit: 'pcs', donor: '' 
  });

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res = await getResources();
      setData(res.data || []);
    } catch (err) {
      console.error("Fetch Inventory Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDonors = async () => {
    try {
      const res = await getDonors();
      setDonors(res.data || []);
    } catch (err) {
      console.error("Fetch Donors Error:", err);
    }
  };

  useEffect(() => {
    fetchInventory();
    fetchDonors();
  }, []);

  // --- FIXED DELETE LOGIC ---
  const handleDelete = async (id) => {
    if (!window.confirm("Permanent Action: Are you sure you want to purge this resource?")) return;
    
    try {
      await deleteResource(id);
      // Optimistic Update: Remove from UI immediately
      setData(prev => prev.filter(item => item._id !== id));
    } catch (err) {
      alert("Delete Failed: " + (err.response?.data?.message || "Server Error"));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addResource(formData);
      setShowForm(false);
      setFormData({ name: '', category: 'General', quantity: '', unit: 'pcs', donor: '' });
      fetchInventory(); // Reload full list
    } catch (err) {
      alert("Error saving: " + (err.response?.data?.message || err.message));
    }
  };

  const filteredData = data.filter(item => 
    item.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-10 max-w-7xl mx-auto min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
        <div>
          <h1 className="text-5xl font-black text-slate-900 uppercase tracking-tighter italic flex items-center gap-3">
            <Database className="text-blue-600" size={32} /> Resource Vault
          </h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.5em] mt-4 ml-1">Asset Management System</p>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
              type="text" placeholder="Search inventory..." 
              className="w-full pl-14 pr-6 py-5 bg-white border border-slate-100 rounded-2xl text-sm font-bold shadow-sm outline-none focus:border-blue-500 transition-all"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setShowForm(true)} 
            className="bg-[#0f172a] text-white px-10 py-5 rounded-2xl font-black text-[11px] tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 flex items-center gap-2"
          >
            <PackagePlus size={18} /> ADD ASSET
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-[3rem] border border-slate-50 overflow-hidden shadow-2xl shadow-slate-200/50">
        {loading ? (
          <div className="p-20 text-center font-black animate-pulse text-slate-300 uppercase tracking-widest">Accessing Secure Vault...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-50">
                <th className="p-10 text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset Details</th>
                <th className="p-10 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Current Stock</th>
                <th className="p-10 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredData.map((item) => (
                <tr key={item._id} className="group hover:bg-slate-50/50 transition-all">
                  <td className="p-10">
                    <p className="font-black text-slate-900 uppercase text-sm italic tracking-tight">{item.name}</p>
                    <p className="text-[10px] text-blue-600 font-black uppercase flex items-center gap-1.5 mt-2">
                      <User size={12}/> {item.donor?.name || "Verified Anonymous"}
                    </p>
                  </td>
                  <td className="p-10 text-center">
                    <span className="bg-slate-100 text-slate-900 px-6 py-2 rounded-xl font-black text-xs uppercase tracking-tighter">
                      {item.quantity} <span className="text-slate-400 ml-1">{item.unit}</span>
                    </span>
                  </td>
                  <td className="p-10 text-right">
                    <button 
                      onClick={() => handleDelete(item._id)} 
                      className="text-slate-200 hover:text-red-500 p-3 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 size={20}/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-6">
          <div className="bg-white p-12 rounded-[3.5rem] w-full max-w-lg shadow-2xl relative border border-white">
            <button onClick={() => setShowForm(false)} className="absolute top-10 right-10 text-slate-300 hover:text-red-500 transition-colors"><X /></button>
            <h2 className="text-3xl font-black text-slate-900 mb-10 uppercase tracking-tighter italic">Register Resource</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Source Verification</label>
                <select 
                  className="w-full p-5 bg-slate-50 border-2 border-slate-50 rounded-2xl font-bold text-sm outline-none focus:border-blue-600 transition-all"
                  value={formData.donor}
                  onChange={e => setFormData({...formData, donor: e.target.value})}
                  required
                >
                  <option value="">Select Origin Donor</option>
                  {donors.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Asset Name</label>
                <input 
                  type="text" placeholder="e.g. Rice, Medicine" 
                  className="w-full p-5 bg-slate-50 border-2 border-slate-50 rounded-2xl font-bold text-sm outline-none focus:border-blue-600 transition-all" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})} required 
                />
              </div>

              <div className="flex gap-4">
                <div className="w-1/2 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Quantity</label>
                  <input 
                    type="number" placeholder="00" 
                    className="w-full p-5 bg-slate-50 border-2 border-slate-50 rounded-2xl font-bold text-sm outline-none focus:border-blue-600 transition-all" 
                    value={formData.quantity}
                    onChange={e => setFormData({...formData, quantity: e.target.value})} required 
                  />
                </div>
                <div className="w-1/2 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Unit</label>
                  <input 
                    type="text" placeholder="kg/pcs" 
                    className="w-full p-5 bg-slate-50 border-2 border-slate-50 rounded-2xl font-bold text-sm outline-none focus:border-blue-600 transition-all" 
                    value={formData.unit}
                    onChange={e => setFormData({...formData, unit: e.target.value})} required 
                  />
                </div>
              </div>

              <button type="submit" className="w-full bg-blue-600 text-white p-6 rounded-[2rem] font-black uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-slate-900 transition-all active:scale-95">
                Commit to Database
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Resources;