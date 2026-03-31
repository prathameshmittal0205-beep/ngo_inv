import React, { useEffect, useState } from 'react';
import { getDistribution, getResources } from '../api';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid 
} from 'recharts';
import { BarChart3, PieChart as PieIcon, Activity, Layers, Package } from 'lucide-react';

const Analytics = () => {
  const [distributionData, setDistributionData] = useState([]);
  const [itemData, setItemData] = useState([]);
  const [activeTab, setActiveTab] = useState('category'); // 'category' or 'items'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch both datasets simultaneously
    Promise.all([getDistribution(), getResources()])
      .then(([distRes, itemsRes]) => {
        setDistributionData(distRes.data);
        
        // Transform resource data for the Bar Chart: { name, quantity }
        const formattedItems = itemsRes.data.map(item => ({
          name: item.name,
          quantity: item.quantity
        })).slice(0, 10); // Limit to top 10 to keep it clean
        
        setItemData(formattedItems);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  if (loading) return <div className="p-20 text-center font-black animate-pulse text-slate-300">CALCULATING INTELLIGENCE...</div>;

  return (
    <div className="p-10 max-w-7xl mx-auto min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-[#0f172a] uppercase tracking-tighter flex items-center gap-3">
            <Activity className="text-blue-600" /> Database Intelligence
          </h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] mt-2 pl-1">Visual Resource Allocation</p>
        </div>

        {/* TOGGLE BUTTONS */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button 
            onClick={() => setActiveTab('category')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === 'category' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Layers size={14} /> By Category
          </button>
          <button 
            onClick={() => setActiveTab('items')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === 'items' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Package size={14} /> By Item
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
          <h3 className="font-black text-slate-400 uppercase text-[10px] tracking-widest mb-10 flex items-center gap-2">
            {activeTab === 'category' ? <PieIcon size={14} /> : <BarChart3 size={14} />}
            {activeTab === 'category' ? 'Stock Distribution by Category' : 'Specific Item Stock Levels'}
          </h3>

          <div className="h-[450px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              {activeTab === 'category' ? (
                /* PIE CHART */
                <PieChart>
                  <Pie
                    data={distributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={140}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', fontWeight: 'bold', fontSize: '12px' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ paddingTop: '40px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }} />
                </PieChart>
              ) : (
                /* BAR CHART */
                <BarChart data={itemData} layout="vertical" margin={{ left: 40, right: 40 }}>
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={100}
                    style={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', fill: '#64748b' }}
                  />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                  />
                  <Bar 
                    dataKey="quantity" 
                    fill="#3b82f6" 
                    radius={[0, 10, 10, 0]} 
                    barSize={30}
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;