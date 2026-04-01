import React, { useEffect, useState } from 'react';
import { getDonations, getDonors, addDonation, deleteDonation } from '../api';
import { 
  HeartHandshake, Plus, X, PackageOpen, 
  Trash2, IndianRupee, FileText, Search, 
  ShieldCheck, Lock, Download, Activity
} from 'lucide-react';

// --- PDF LIBRARIES ---
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const Donations = () => {
  const [donations, setDonations] = useState([]);
  const [donors, setDonors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({ 
    donor: '', 
    item: '', 
    quantity: '', 
    unit: '', 
    amount: '' 
  });
  const [loading, setLoading] = useState(true);

  const userRole = localStorage.getItem('role');

  const loadData = async () => {
    try {
      setLoading(true);
      const [donRes, donorRes] = await Promise.all([getDonations(), getDonors()]);
      setDonations(donRes.data || []);
      setDonors(donorRes.data || []);
    } catch (err) { 
      console.error("Fetch error:", err); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDonation(formData);
      setShowForm(false);
      setFormData({ donor: '', item: '', quantity: '', unit: '', amount: '' });
      loadData();
      alert("Entry successfully committed!");
    } catch (err) {
      console.error("Submission failed:", err.response?.data);
      alert(err.response?.data?.error || "Commit Failed.");
    }
  };

  // --- NEW DELETE HANDLER ---
  const handleDelete = async (id) => {
    if (window.confirm("CRITICAL: Purging this record will also deduct its quantity from the Global Vault. Proceed?")) {
      try {
        await deleteDonation(id);
        // Optimistic UI update or reload
        setDonations(prev => prev.filter(item => item._id !== id));
        alert("Ledger entry purged successfully.");
      } catch (err) {
        console.error("Delete error:", err);
        alert("Failed to purge entry. Check console for details.");
      }
    }
  };

  const generateReceipt = (d) => {
    try {
      const doc = new jsPDF();
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, 210, 40, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.text("NGO ENGINE", 20, 25);
      
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      const donorName = typeof d.donor === 'object' ? d.donor?.name : (d.donor || 'Anonymous');
      
      doc.text(`Receipt ID: ${d._id?.toUpperCase() || "N/A"}`, 20, 60);
      doc.text(`Donor: ${donorName}`, 20, 70);
      doc.text(`Date: ${new Date(d.createdAt).toLocaleDateString()}`, 20, 80);

      autoTable(doc, {
        startY: 90,
        head: [['RESOURCE', 'QUANTITY', 'RECORDED VALUE']],
        body: [[
          (d.item || "ITEM").toUpperCase(), 
          `${d.quantity || 0} ${d.unit || 'units'}`, 
          `INR ${(d.amount || 0).toLocaleString('en-IN')}`
        ]],
        theme: 'striped',
        headStyles: { fillColor: [37, 99, 235] }
      });

      doc.save(`Receipt_${d._id?.slice(-4)}.pdf`);
    } catch (err) {
      console.error("PDF Error:", err);
      alert("PDF Tool Error.");
    }
  };

  const exportToCSV = () => {
    const headers = "Donor,Item,Quantity,Value,Date\n";
    const rows = donations.map(d => {
      const dName = typeof d.donor === 'object' ? d.donor?.name : (d.donor || 'Anon');
      return `${dName},${d.item},${d.quantity} ${d.unit},${d.amount},${new Date(d.createdAt).toLocaleDateString()}`;
    }).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'NGO_Audit_Log.csv'; a.click();
  };

  if (loading) return <div className="p-20 text-center font-black animate-pulse text-slate-300 uppercase tracking-widest">Updating Ledger...</div>;

  return (
    <div className="p-10 max-w-7xl mx-auto min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-12">
        <div>
          <h1 className="text-5xl font-black text-[#0f172a] uppercase tracking-tighter italic flex items-center gap-3">
            <Activity className="text-blue-600" /> Contributions
          </h1>
          <div className="flex items-center gap-3 mt-4">
            <ShieldCheck className="text-emerald-500" size={18} />
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.5em]">Secure Audit Trail</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button onClick={exportToCSV} className="bg-white border-2 border-slate-100 px-6 py-4 rounded-2xl font-black text-[11px] tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2">
            <Download size={16} /> CSV EXPORT
          </button>
          <button onClick={() => setShowForm(true)} className="bg-[#0f172a] text-white px-8 py-4 rounded-2xl font-black text-[11px] tracking-widest hover:bg-blue-600 transition-all shadow-xl">
            RECORD ENTRY
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-10">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text" placeholder="Search secure ledger..." 
          className="w-full pl-14 pr-6 py-5 bg-white border border-slate-100 rounded-[2rem] text-sm font-bold shadow-sm outline-none focus:border-blue-500 transition-all"
          onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
        />
      </div>

      {/* Donation Cards */}
      <div className="grid grid-cols-1 gap-5">
        {donations
          .filter(d => {
            const dName = typeof d.donor === 'object' ? d.donor?.name : d.donor;
            return dName?.toLowerCase().includes(searchTerm) || d.item?.toLowerCase().includes(searchTerm);
          })
          .map(d => {
            const displayDonorName = typeof d.donor === 'object' ? d.donor?.name : (d.donor || 'Anonymous');

            return (
              <div key={d._id} className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm flex items-center justify-between group hover:border-blue-200 transition-all">
                <div className="flex items-center gap-8">
                  <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <HeartHandshake size={24} />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 uppercase text-sm tracking-tight">{displayDonorName}</h3>
                    <p className="text-slate-400 font-bold text-xs mt-1">
                      {d.quantity} {d.unit} of <span className="text-[#0f172a] font-black">{d.item}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-xl font-black text-[#0f172a] flex items-center justify-end">
                       <IndianRupee size={16} className="inline mr-1"/>{d.amount?.toLocaleString('en-IN')}
                    </p>
                    <p className="text-[10px] text-slate-300 font-black mt-1 uppercase">{new Date(d.createdAt).toLocaleDateString()}</p>
                  </div>
                  <button onClick={() => generateReceipt(d)} className="p-3 bg-slate-50 text-slate-400 hover:text-blue-600 rounded-xl transition-all">
                    <FileText size={20} />
                  </button>
                  
                  {/* Updated Admin Delete Logic */}
                  {userRole === 'admin' && (
                    <button 
                      onClick={() => handleDelete(d._id)} 
                      className="p-3 text-slate-200 hover:text-red-500 rounded-xl transition-all"
                      title="Purge Record"
                    >
                        <Trash2 size={20} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
      </div>

      {/* Form Modal remains unchanged... */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-6">
          <div className="bg-white p-12 rounded-[3.5rem] w-full max-w-lg shadow-2xl relative border border-white">
            <button onClick={() => setShowForm(false)} className="absolute top-10 right-10 text-slate-300 hover:text-red-500 transition-colors">
               <X />
            </button>
            <h2 className="text-2xl font-black text-[#0f172a] mb-10 uppercase text-center tracking-tighter italic">Commit New Entry</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <select 
                className="w-full p-5 bg-slate-50 border-2 border-slate-50 rounded-2xl font-bold text-sm outline-none focus:border-blue-600 transition-all" 
                required 
                value={formData.donor}
                onChange={e => setFormData({...formData, donor: e.target.value})}
              >
                <option value="">Select Verified Donor...</option>
                {donors.map(don => <option key={don._id} value={don._id}>{don.name}</option>)}
              </select>

              <input 
                type="text" 
                placeholder="Resource (e.g. Oxygen)" 
                className="w-full p-5 bg-slate-50 border-2 border-slate-50 rounded-2xl font-bold text-sm outline-none focus:border-blue-600 transition-all" 
                required 
                value={formData.item}
                onChange={e => setFormData({...formData, item: e.target.value})} 
              />

              <div className="flex gap-4">
                <input 
                  type="number" 
                  placeholder="Qty" 
                  className="w-1/2 p-5 bg-slate-50 border-2 border-slate-50 rounded-2xl font-bold text-sm outline-none focus:border-blue-600 transition-all" 
                  required 
                  value={formData.quantity}
                  onChange={e => setFormData({...formData, quantity: e.target.value})} 
                />
                <input 
                  type="text" 
                  placeholder="Unit" 
                  className="w-1/2 p-5 bg-slate-50 border-2 border-slate-50 rounded-2xl font-bold text-sm outline-none focus:border-blue-600 transition-all" 
                  required 
                  value={formData.unit}
                  onChange={e => setFormData({...formData, unit: e.target.value})} 
                />
              </div>

              <input 
                type="number" 
                placeholder="Valuation (INR)" 
                className="w-full p-5 bg-slate-50 border-2 border-slate-50 rounded-2xl font-bold text-sm outline-none focus:border-blue-600 transition-all" 
                required 
                value={formData.amount}
                onChange={e => setFormData({...formData, amount: e.target.value})} 
              />

              <button 
                type="submit" 
                className="w-full bg-[#0f172a] text-white p-6 rounded-[2.5rem] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all active:scale-95"
              >
                Commit to Ledger
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Donations;