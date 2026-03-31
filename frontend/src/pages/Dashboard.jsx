import React, { useEffect, useState } from 'react';
import { getStats, getDistribution, getTopDonors } from '../api'; // IMPORTED getTopDonors
import { 
  Users, Package, BarChart3, PieChart as PieIcon, 
  TrendingUp, AlertTriangle, IndianRupee, CheckCircle, Clock, Zap, Trophy
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend
} from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalDonors: 0,
    totalResources: 0,
    totalStock: 0,
    totalFunds: 0,
    fulfilledCount: 0
  });
  const [distribution, setDistribution] = useState([]);
  const [topDonors, setTopDonors] = useState([]); // NEW STATE FOR TOP DONORS

  const fetchData = async () => {
    try {
      // FETCH ALL THREE DATA POINTS IN PARALLEL
      const [statsRes, distRes, topRes] = await Promise.all([
        getStats(), 
        getDistribution(),
        getTopDonors() 
      ]);
      setStats(statsRes.data);
      setDistribution(distRes.data);
      setTopDonors(topRes.data);
    } catch (err) {
      console.error("Dashboard Sync Error:", err);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const COLORS = ['#2563eb', '#7c3aed', '#db2777', '#ea580c', '#16a34a', '#a855f7', '#f97316'];

  const calculateDays = (value) => {
    const val = Number(value);
    if (val > 100) return 45;
    if (val > 50) return 18;
    if (val > 10) return 5;
    return 2;
  };

  const statCards = [
    { label: 'Total Funds', value: `₹${(stats.totalFunds || 0).toLocaleString('en-IN')}`, icon: <IndianRupee size={20}/>, color: 'bg-blue-600' },
    { label: 'Active Donors', value: stats.totalDonors || 0, icon: <Users size={20}/>, color: 'bg-slate-900' },
    { label: 'Total Inventory', value: stats.totalStock || 0, icon: <Package size={20}/>, color: 'bg-indigo-600' },
    { label: 'Impact / Fulfilled', value: stats.fulfilledCount || 0, icon: <CheckCircle size={20}/>, color: 'bg-emerald-600' },
  ];

  const renderLegendText = (value) => (
    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-3">{value}</span>
  );

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.05) return null; 
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const RADIAN = Math.PI / 180;
    const ex = cx + radius * Math.cos(-midAngle * RADIAN);
    const ey = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text x={ex} y={ey} fill="white" textAnchor="middle" dominantBaseline="central" className="text-[10px] font-extrabold">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="p-10 max-w-7xl mx-auto min-h-screen">
      {/* HEADER */}
      <div className="mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black text-slate-900 uppercase tracking-tighter italic">Command Center</h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] mt-2 ml-1">Real-time NGO Operations</p>
        </div>
        <div className="bg-emerald-50 px-5 py-3 rounded-2xl flex items-center gap-3 border border-emerald-100 shadow-sm">
          <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></div>
          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Live Sync: Active</span>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {statCards.map((card, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-xl shadow-slate-100/40 group hover:scale-[1.02] transition-all cursor-default">
            <div className={`w-12 h-12 ${card.color} text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
              {card.icon}
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{card.label}</p>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter italic">{card.value}</h2>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* RESOURCE LONGEVITY */}
        <div className="lg:col-span-1 bg-white p-10 rounded-[3rem] border border-slate-50 shadow-xl shadow-slate-100/40 flex flex-col">
          <h3 className="text-lg font-black text-slate-900 uppercase mb-8 flex items-center gap-2 tracking-tight">
            <Clock size={20} className="text-orange-500"/> Resource Longevity
          </h3>
          <div className="space-y-7 overflow-y-auto pr-4 max-h-[350px] custom-scrollbar">
            {distribution.map((item, index) => {
              const days = calculateDays(item.value);
              return (
                <div key={index} className="group transition-all">
                  <div className="flex justify-between items-end mb-2">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Stock: {item.value}</span>
                      <span className="text-xs font-black text-slate-800 uppercase tracking-tight">{item.name}</span>
                    </div>
                    <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${days < 7 ? 'bg-red-50 text-red-500 border-red-100' : 'bg-blue-50 text-blue-600'}`}>
                      {days} Days Left
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-1000 ${days < 7 ? 'bg-red-500' : 'bg-blue-600'}`} style={{ width: `${Math.min(100, (days / 50) * 100)}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* PIE CHART */}
        <div className="bg-white p-10 rounded-[3rem] border border-slate-50 shadow-xl shadow-slate-100/40 flex flex-col">
          <h3 className="text-lg font-black text-slate-900 uppercase mb-4 flex items-center gap-2 tracking-tight">
            <PieIcon size={20} className="text-blue-600"/> Allocation Mix
          </h3>
          <div className="h-64 flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={distribution} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" nameKey="name" labelLine={false} label={renderCustomLabel}>
                  {distribution.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', fontWeight: 'black', fontSize: '11px', textTransform: 'uppercase' }} />
                <Legend iconType="rect" iconSize={10} layout="horizontal" verticalAlign="bottom" align="center" formatter={renderLegendText} wrapperStyle={{ paddingTop: '20px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* OPERATIONAL HEALTH */}
        <div className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl text-white relative overflow-hidden flex flex-col justify-between">
          <TrendingUp className="absolute right-[-30px] bottom-[-30px] text-white/5 pointer-events-none" size={260} />
          <div>
            <h3 className="text-lg font-black uppercase mb-8 flex items-center gap-2 tracking-tight">
              <Zap size={20} className="text-amber-400"/> Operational Health
            </h3>
            <div className="space-y-6 relative z-10">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sync Consistency</span>
                <span className="text-emerald-400 text-[10px] font-black uppercase bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">Optimal</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Vault</span>
                <span className="text-white text-[10px] font-black uppercase">{stats.totalStock || 0} Total Units</span>
              </div>
              <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                 <div className="bg-blue-500 h-full w-[94%] rounded-full shadow-[0_0_15px_rgba(59,130,246,0.6)]"></div>
              </div>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed italic mt-12 border-l-2 border-blue-600 pl-4 relative z-10">
            "Automatic depletion tracking is active. Hall of Fame leaderboard updated based on cumulative contribution volume."
          </p>
        </div>
      </div>

      {/* --- NEW HALL OF FAME SECTION --- */}
      <div className="bg-white p-12 rounded-[3.5rem] border border-slate-50 shadow-xl shadow-slate-100/40">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h3 className="text-2xl font-black text-slate-900 uppercase flex items-center gap-3 tracking-tighter italic">
              <Trophy className="text-amber-500" size={28}/> Hall of Fame
            </h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2 ml-1">Maximum Contributions by Donor</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topDonors.map((donor, index) => (
            <div key={index} className="flex items-center justify-between p-8 bg-slate-50/50 rounded-[2.5rem] border border-slate-50 group hover:bg-slate-900 transition-all duration-300">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center font-black text-slate-900 group-hover:bg-blue-600 group-hover:text-white shadow-sm transition-all text-xl italic">
                  {index + 1}
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900 uppercase tracking-tight group-hover:text-white transition-colors">
                    {donor.name}
                  </p>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1 group-hover:text-slate-500">
                    {donor.donationCount} Records Logged
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-black text-slate-400 uppercase mb-1 group-hover:text-blue-400">Total Value</p>
                <p className="text-lg font-black text-blue-600 group-hover:text-white italic">
                  ₹{donor.totalAmount.toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;