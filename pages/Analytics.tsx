import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { AnalyticsData } from '../types';
import { api } from '../services/api';

export const Analytics: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const result = await api.getAnalytics();
        setData(result);
      } catch (e) {
        console.error("Failed to load analytics");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <div className="space-y-8 w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Analytics</h2>
          <p className="text-slate-500 text-lg mt-1">Insights that drive growth.</p>
        </div>
        <div className="flex bg-white rounded-xl p-1 shadow-sm border border-slate-200">
             <button className="px-4 py-1.5 text-sm font-bold bg-slate-900 text-white rounded-lg shadow-md">7 Days</button>
             <button className="px-4 py-1.5 text-sm font-medium text-slate-500 hover:text-slate-900">30 Days</button>
             <button className="px-4 py-1.5 text-sm font-medium text-slate-500 hover:text-slate-900">3 Months</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Main Bar Chart */}
        <div className="bg-white p-8 rounded-3xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] border border-slate-100 min-h-[400px]">
          <h3 className="font-bold text-xl text-slate-900 mb-8 tracking-tight">Weekly Engagement</h3>
          <div className="h-80 w-full">
            {isLoading || !data ? (
                <div className="w-full h-full flex items-end justify-between gap-4 animate-pulse px-4">
                    {Array(7).fill(0).map((_, i) => (
                        <div key={i} className="bg-slate-100 w-full rounded-t-lg" style={{ height: `${Math.random() * 80 + 20}%`}}></div>
                    ))}
                </div>
            ) : (
                <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.weeklyActivity} barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 500}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{border: 'none', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px'}}
                    itemStyle={{fontSize: '12px', fontWeight: 600, padding: '2px 0'}}
                    />
                    <Bar dataKey="sent" fill="#e2e8f0" radius={[6, 6, 0, 0]} name="Sent" />
                    <Bar dataKey="delivered" fill="#6366f1" radius={[6, 6, 0, 0]} name="Delivered" />
                    <Bar dataKey="replied" fill="#10b981" radius={[6, 6, 0, 0]} name="Replied" />
                </BarChart>
                </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Pie Chart & Stats */}
        <div className="bg-white p-8 rounded-3xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col min-h-[400px]">
          <h3 className="font-bold text-xl text-slate-900 mb-8 tracking-tight">Delivery Health</h3>
          <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-12">
            <div className="w-56 h-56 relative">
              {isLoading || !data ? (
                  <div className="w-full h-full rounded-full border-8 border-slate-100 animate-pulse"></div>
              ) : (
               <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.deliveryStats}
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                    cornerRadius={5}
                  >
                    {data.deliveryStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{border: 'none', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                </PieChart>
              </ResponsiveContainer>
              )}
              {!isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                    <span className="text-4xl font-extrabold text-slate-900 tracking-tight">98%</span>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Success</span>
                  </div>
              )}
            </div>
            
            <div className="space-y-6 w-full md:w-auto">
              {(isLoading ? Array(3).fill(0) : data!.deliveryStats).map((item: any, i) => (
                isLoading ? (
                    <div key={i} className="h-6 w-32 bg-slate-100 rounded animate-pulse"></div>
                ) : (
                    <div key={item.name} className="flex items-center justify-between gap-12 group">
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full ring-4 ring-opacity-20 transition-all group-hover:scale-110" style={{ backgroundColor: item.color, '--tw-ring-color': item.color } as any} />
                        <span className="text-slate-600 font-semibold text-sm">{item.name}</span>
                    </div>
                    <span className="font-bold text-slate-900 font-mono">{item.value}</span>
                    </div>
                )
              ))}
            </div>
          </div>
        </div>
      </div>

       {/* Reply Times Line Chart */}
       <div className="bg-white p-8 rounded-3xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] border border-slate-100 min-h-[400px]">
          <h3 className="font-bold text-xl text-slate-900 mb-2 tracking-tight">Peak Activity</h3>
          <p className="text-sm text-slate-500 mb-8 font-medium">Best times for customer engagement based on reply speed.</p>
          <div className="h-72 w-full">
            {isLoading || !data ? (
                <div className="w-full h-full bg-slate-50/50 rounded-xl animate-pulse"></div>
            ) : (
                <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.peakTimes}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 500}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <Tooltip contentStyle={{border: 'none', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                    <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#8b5cf6" 
                        strokeWidth={4} 
                        dot={{r: 4, fill: '#fff', strokeWidth: 2, stroke: '#8b5cf6'}} 
                        activeDot={{r: 6, fill: '#8b5cf6', strokeWidth: 0}}
                    />
                </LineChart>
                </ResponsiveContainer>
            )}
          </div>
        </div>
    </div>
  );
};
