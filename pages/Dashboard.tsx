import React, { useEffect, useState } from 'react';
import { Users, Send, MessageCircle, AlertCircle, Clock, ArrowUpRight, ArrowDownRight, MoreHorizontal, RefreshCcw, Plus, Calendar, Megaphone } from 'lucide-react';
import { Metric, ActivityLog, Schedule } from '../types';
import { api } from '../services/api';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
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
      
      {/* Hero / Quick Actions */}
      <div className="bg-white rounded-3xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] border border-slate-100 p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-1">
             <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Today's Snapshot</h2>
             <p className="text-slate-500 text-lg">Here is what is happening right now.</p>
          </div>
          
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
             <button 
               onClick={() => onNavigate('contacts')}
               className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl font-bold transition-all shadow-sm border border-indigo-100"
             >
                <Plus size={18} strokeWidth={2.5} />
                Add Customer
             </button>
             <button 
               onClick={() => onNavigate('automation')}
               className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl font-bold transition-all shadow-sm border border-indigo-100"
             >
                <Calendar size={18} strokeWidth={2.5} />
                Create Schedule
             </button>
             <button 
               onClick={() => onNavigate('automation')} 
               className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl font-bold transition-all shadow-sm border border-rose-100"
             >
                <Megaphone size={18} strokeWidth={2.5} />
                Blast Reminder
             </button>
             <button 
               onClick={() => onNavigate('inbox')}
               className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white hover:bg-slate-800 rounded-xl font-bold transition-all shadow-lg shadow-slate-200"
             >
                <MessageCircle size={18} strokeWidth={2.5} />
                Go to Inbox
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
           {isLoading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="h-24 bg-slate-50 rounded-2xl animate-pulse"></div>
              ))
           ) : stats ? (
             <>
               <div className="bg-indigo-50/50 rounded-2xl p-6 border border-indigo-100 flex items-center gap-5 relative overflow-hidden group">
                  <div className="absolute right-0 top-0 p-16 bg-indigo-200/20 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-200/30 transition-colors"></div>
                  <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center text-indigo-600 shrink-0 z-10">
                     <Send size={28} />
                  </div>
                  <div className="z-10">
                     <p className="text-slate-500 font-bold text-sm uppercase tracking-wide">Sent Today</p>
                     <h3 className="text-4xl font-bold text-slate-900 tracking-tight">{stats.find(s => s.label.includes('Sent'))?.value || 0}</h3>
                  </div>
               </div>

               <div className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-100 flex items-center gap-5 relative overflow-hidden group">
                  <div className="absolute right-0 top-0 p-16 bg-emerald-200/20 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-200/30 transition-colors"></div>
                  <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center text-emerald-600 shrink-0 z-10">
                     <MessageCircle size={28} />
                  </div>
                  <div className="z-10">
                     <p className="text-slate-500 font-bold text-sm uppercase tracking-wide">Replies Waiting</p>
                     <h3 className="text-4xl font-bold text-slate-900 tracking-tight">{stats.find(s => s.label.includes('Replie'))?.value || 0}</h3>
                  </div>
               </div>

               <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100 flex items-center gap-5 relative overflow-hidden group">
                  <div className="absolute right-0 top-0 p-16 bg-blue-200/20 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-200/30 transition-colors"></div>
                  <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600 shrink-0 z-10">
                     <Users size={28} />
                  </div>
                  <div className="z-10">
                     <p className="text-slate-500 font-bold text-sm uppercase tracking-wide">Total Clients</p>
                     <h3 className="text-4xl font-bold text-slate-900 tracking-tight">{stats.find(s => s.label.includes('Total'))?.value || 0}</h3>
                  </div>
               </div>
             </>
           ) : null}
        </div>
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
          <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-6">Running Today</h3>
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
          <button 
             onClick={() => onNavigate('automation')}
             className="w-full mt-6 py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 hover:text-indigo-600 hover:border-indigo-200 text-sm font-bold transition-all hover:bg-indigo-50/20"
          >
            + Add New Schedule
          </button>
        </div>
      </div>
    </div>
  );
};