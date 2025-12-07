import React, { useEffect, useState } from 'react';
import { Users, Send, MessageCircle, AlertCircle, Clock, ArrowUpRight, ArrowDownRight, MoreHorizontal, RefreshCcw } from 'lucide-react';
import { Metric, ActivityLog, Schedule } from '../types';
import { api } from '../services/api';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Metric[] | null>(null);
  const [activity, setActivity] = useState<ActivityLog[] | null>(null);
  const [schedules, setSchedules] = useState<Schedule[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [statsData, activityData, scheduleData] = await Promise.all([
        api.getDashboardStats(),
        api.getRecentActivity(),
        api.getSchedules()
      ]);
      setStats(statsData);
      setActivity(activityData);
      setSchedules(scheduleData.slice(0, 3)); // Only show top 3
    } catch (err) {
      setError("Failed to load dashboard data. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4">
        <AlertCircle size={48} className="text-rose-400" />
        <p className="text-lg font-medium">{error}</p>
        <button onClick={fetchData} className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          <RefreshCcw size={16} /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in w-full">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Good Morning, Owner</h2>
          <p className="text-slate-500 mt-1 text-lg">Here's what's happening with your business today.</p>
        </div>
        <button className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg shadow-slate-200 transition-all hover:-translate-y-0.5 font-medium">
          <Send size={18} />
          <span>Quick Blast</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          // Skeleton Loader
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 animate-pulse">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-slate-200 rounded-xl"></div>
                <div className="w-16 h-6 bg-slate-200 rounded-full"></div>
              </div>
              <div className="w-20 h-10 bg-slate-200 rounded mb-2"></div>
              <div className="w-32 h-4 bg-slate-200 rounded"></div>
            </div>
          ))
        ) : (
          stats?.map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${
                  idx === 0 ? 'bg-indigo-50 text-indigo-600' :
                  idx === 1 ? 'bg-emerald-50 text-emerald-600' :
                  idx === 2 ? 'bg-amber-50 text-amber-600' :
                  'bg-rose-50 text-rose-600'
                }`}>
                  {idx === 0 && <Send size={22} />}
                  {idx === 1 && <Users size={22} />}
                  {idx === 2 && <MessageCircle size={22} />}
                  {idx === 3 && <AlertCircle size={22} />}
                </div>
                {stat.change !== undefined && (
                  <div className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
                    stat.trend === 'up' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                  }`}>
                    {stat.trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {Math.abs(stat.change)}%
                  </div>
                )}
              </div>
              <h3 className="text-4xl font-bold text-slate-900 tracking-tight mb-1">{stat.value}</h3>
              <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
            </div>
          ))
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="xl:col-span-2 bg-white rounded-3xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-slate-100 p-8 min-h-[400px]">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-xl font-bold text-slate-900 tracking-tight">Recent Activity</h3>
             <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
               <MoreHorizontal size={20} />
             </button>
          </div>
          
          <div className="space-y-1">
            {isLoading ? (
               Array(4).fill(0).map((_, i) => (
                 <div key={i} className="flex items-center justify-between p-4 border-b border-slate-50 last:border-0 animate-pulse">
                   <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-slate-200 rounded-2xl"></div>
                     <div className="space-y-2">
                       <div className="w-32 h-4 bg-slate-200 rounded"></div>
                       <div className="w-48 h-3 bg-slate-200 rounded"></div>
                     </div>
                   </div>
                 </div>
               ))
            ) : activity && activity.length > 0 ? (
              activity.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm bg-indigo-50 text-indigo-600`}>
                      {item.userInitials}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">{item.user}</p>
                      <p className="text-sm text-slate-500">{item.action} <span className="text-slate-700 font-medium">"{item.target}"</span></p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 font-medium bg-slate-50 px-2 py-1 rounded-lg group-hover:bg-white group-hover:shadow-sm">{item.time}</span>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-center py-8">No recent activity.</p>
            )}
          </div>
          <button className="w-full mt-6 py-3 text-center text-slate-600 text-sm font-semibold hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-200">View All Activity</button>
        </div>

        {/* Upcoming Schedule */}
        <div className="bg-white rounded-3xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-slate-100 p-8 flex flex-col min-h-[400px]">
          <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-6">Scheduled Today</h3>
          <div className="space-y-4 flex-1">
            {isLoading ? (
               Array(3).fill(0).map((_, i) => (
                 <div key={i} className="p-4 rounded-2xl border border-slate-100 animate-pulse bg-slate-50/50 h-20"></div>
               ))
            ) : schedules && schedules.length > 0 ? (
              schedules.map((schedule) => (
                <div key={schedule.id} className="flex items-start gap-4 p-4 rounded-2xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all group">
                  <div className="bg-indigo-50 p-2.5 rounded-xl text-indigo-600 group-hover:bg-indigo-100 transition-colors">
                     <Clock size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{schedule.name}</h4>
                    <p className="text-xs text-slate-500 mt-1 font-medium">{schedule.time} • <span className="text-indigo-600">{schedule.recipientCount || 0} Recipients</span></p>
                  </div>
                </div>
              ))
            ) : (
               <p className="text-slate-400 text-center py-8">No schedules active today.</p>
            )}
          </div>
          <button className="w-full mt-6 py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 hover:text-indigo-600 hover:border-indigo-200 text-sm font-bold transition-all hover:bg-indigo-50/20">
            + Add New Schedule
          </button>
        </div>
      </div>
    </div>
  );
};
