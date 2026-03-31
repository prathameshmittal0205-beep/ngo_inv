import React, { useEffect, useState } from 'react';
import { getRequests, addRequest, updateRequest } from '../api'; 
import { ClipboardList, CheckCircle, Clock, MapPin, Plus, X, Search, ShieldCheck, Activity } from 'lucide-react';

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ beneficiary: '', item: '', quantity: '', location: '' });
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await getRequests();
      setRequests(res.data || []);
    } catch (err) { 
      console.error("Fetch Error:", err); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  // --- THE FIXED FULFILLMENT LOGIC ---
  const handleFulfill = async (id) => {
    try {
      // Using the unified updateRequest from your api.js
      const res = await updateRequest(id, { status: 'Fulfilled' });
      alert(res.data.message || "Fulfillment successful!");
      fetchRequests();
    } catch (err) {
      alert(err.response?.data?.message || "Fulfillment Failed: Check resource stock.");
    }
  };

  // --- THE FIXED SUBMIT LOGIC ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addRequest(formData);
      setShowForm(false);
      setFormData({ beneficiary: '', item: '', quantity: '', location: '' });
      fetchRequests();
      alert("Need successfully recorded in registry.");
    } catch (err) {
      alert("Failed to add request. Check backend connection.");
    }
  };

  const filteredRequests = requests.filter(r => 
    r.beneficiary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.item?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && requests.length === 0) return (
    <div className="p-20 text-center font-black animate-pulse text-slate-300 uppercase tracking-[0.5em]">
      Syncing Registry...
    </div>
  );

  return (
    <div className="p-10 max-w-7xl mx-auto min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-12">
        <div>
          <h1 className="text-5xl font-black text-slate-900 uppercase tracking-tighter italic flex items-center gap-3">
            <ClipboardList className="text-blue-600" /> Need Registry
          </h1>
          <div className="flex items-center gap-3 mt-4">
            <Activity className="text-blue-500" size={18} />
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.5em]">Active Fulfillment Queue</p>
          </div>
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
              type="text" 
              placeholder="Search by beneficiary or item..." 
              className="w-full pl-14 pr-6 py-5 bg-white border border-slate-100 rounded-[2rem] text-sm font-bold shadow-sm outline-none focus:border-blue-500 transition-all"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setShowForm(true)} 
            className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-black text-[11px] tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-blue-100 flex items-center gap-2"
          >
            <Plus size={18}/> NEW NEED
          </button>
        </div>
      </div>

      {/* REQUEST CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredRequests.map((req) => (
          <div key={req._id} className={`bg-white p-8 rounded-[3.5rem] border border-slate-50 transition-all hover:scale-[1.02] ${req.status === 'Fulfilled' ? 'opacity-60 bg-slate-50/50' : 'shadow-2xl shadow-slate-200/40'}`}>
            <div className="flex justify-between items-start mb-8">
              <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest ${req.status === 'Fulfilled' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                {req.status === 'Fulfilled' ? 'Dispatched' : 'Awaiting Resource'}
              </span>
              <p className="text-[10px] font-mono text-slate-300">#{req._id.slice(-4).toUpperCase()}</p>
            </div>
            
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2 italic">{req.beneficiary}</h3>
            <p className="text-blue-600 font-black text-xs uppercase tracking-widest mb-6">
              {req.quantity} units <span className="text-slate-400">of</span> {req.item}
            </p>
            
            <div className="flex items-center gap-2 text-slate-400 mb-10">
              <MapPin size={14} className="text-blue-500" />
              <span className="text-[10px] font-black uppercase tracking-widest">{req.location}</span>
            </div>

            {req.status !== 'Fulfilled' ? (
              <button 
                onClick={() => handleFulfill(req._id)}
                className="w-full bg-[#0f172a] text-white py-5 rounded-[1.8rem] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-emerald-500 transition-all shadow-lg active:scale-95"
              >
                Execute Fulfillment
              </button>
            ) : (
              <div className="w-full py-5 text-center bg-emerald-50 rounded-[1.8rem] text-emerald-600 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                <CheckCircle size={14}/> Impact Recorded
              </div>
            )}
          </div>
        ))}
      </div>

      {/* NEW NEED MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-6">
          <div className="bg-white p-12 rounded-[3.5rem] w-full max-w-lg shadow-2xl relative border border-white">
            <button onClick={() => setShowForm(false)} className="absolute top-10 right-10 text-slate-300 hover:text-red-500 transition-colors"><X /></button>
            <h2 className="text-3xl font-black text-slate-900 mb-10 uppercase tracking-tighter italic">New Need Entry</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <input 
                type="text" 
                placeholder="Beneficiary (e.g. VIT Shelter)" 
                className="w-full p-5 bg-slate-50 border-2 border-slate-50 rounded-2xl font-bold text-sm outline-none focus:border-blue-500 transition-all" 
                value={formData.beneficiary}
                onChange={e => setFormData({...formData, beneficiary: e.target.value})} 
                required 
              />
              <input 
                type="text" 
                placeholder="Item (e.g. Medicine)" 
                className="w-full p-5 bg-slate-50 border-2 border-slate-50 rounded-2xl font-bold text-sm outline-none focus:border-blue-500 transition-all" 
                value={formData.item}
                onChange={e => setFormData({...formData, item: e.target.value})} 
                required 
              />
              <div className="flex gap-4">
                <input 
                  type="number" 
                  placeholder="Qty" 
                  className="w-1/2 p-5 bg-slate-50 border-2 border-slate-50 rounded-2xl font-bold text-sm outline-none focus:border-blue-500 transition-all" 
                  value={formData.quantity}
                  onChange={e => setFormData({...formData, quantity: e.target.value})} 
                  required 
                />
                <input 
                  type="text" 
                  placeholder="Location" 
                  className="w-1/2 p-5 bg-slate-50 border-2 border-slate-50 rounded-2xl font-bold text-sm outline-none focus:border-blue-500 transition-all" 
                  value={formData.location}
                  onChange={e => setFormData({...formData, location: e.target.value})} 
                  required 
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-blue-600 text-white p-6 rounded-[2rem] font-black uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-slate-900 transition-all active:scale-95"
              >
                Submit to Registry
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Requests;