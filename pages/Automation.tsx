import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, MoreVertical, Plus, Zap, Loader2 } from 'lucide-react';
import { Schedule } from '../types';
import { api } from '../services/api';

export const Automation: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const data = await api.getSchedules();
        setSchedules(data);
      } catch (e) {
        console.error("Failed to fetch schedules");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSchedules();
  }, []);

  const handleToggle = async (id: string, currentStatus: boolean) => {
    setTogglingId(id);
    try {
        await api.toggleSchedule(id);
        setSchedules(prev => prev.map(s => s.id === id ? { ...s, active: !currentStatus } : s));
    } catch (e) {
        console.error("Failed to toggle");
    } finally {
        setTogglingId(null);
    }
  };

  return (
    <div className="space-y-8 w-full">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Automation</h2>
          <p className="text-slate-500 text-lg mt-1">Set it and forget it.</p>
        </div>
        <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 flex items-center gap-2 shadow-lg shadow-indigo-500/20 transition-all hover:-translate-y-0.5 font-medium">
          <Plus size={18} />
          New Schedule
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
            Array(3).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 h-32 animate-pulse border border-slate-100"></div>
            ))
        ) : (
          schedules.map((schedule) => (
            <div key={schedule.id} className={`bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] border p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all group ${schedule.active ? 'border-slate-100 hover:border-indigo-200' : 'border-slate-100 opacity-60 grayscale-[0.5]'}`}>
              <div className="flex items-start gap-5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${schedule.active ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                  {schedule.frequency === 'one-time' ? <Zap size={24} /> : <Calendar size={24} />}
                </div>
                <div>
                  <h3 className="font-bold text-xl text-slate-900 tracking-tight">{schedule.name}</h3>
                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-500 font-medium">
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-lg border border-slate-100">
                      <Clock size={14} className="text-slate-400" />
                      <span>{schedule.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-lg border border-slate-100">
                      <Users size={14} className="text-slate-400" />
                      <span>{schedule.targetGroup}</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-lg border border-slate-100">
                       <span className="text-indigo-600 uppercase text-xs font-bold tracking-wide">
                          {schedule.frequency}
                       </span>
                       {schedule.days && (
                         <span className="text-slate-400 border-l border-slate-200 pl-2 ml-1">{schedule.days.join(', ')}</span>
                       )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-slate-100 pt-4 md:pt-0">
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-bold ${schedule.active ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {schedule.active ? 'Active' : 'Paused'}
                  </span>
                  <button 
                    onClick={() => handleToggle(schedule.id, schedule.active)}
                    disabled={togglingId === schedule.id}
                    className={`w-12 h-7 rounded-full p-1 transition-all duration-300 relative ${schedule.active ? 'bg-emerald-500 shadow-inner' : 'bg-slate-200'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 flex items-center justify-center ${schedule.active ? 'translate-x-5' : 'translate-x-0'}`}>
                        {togglingId === schedule.id && <Loader2 size={12} className="animate-spin text-slate-400"/>}
                    </div>
                  </button>
                </div>
                <button className="text-slate-400 hover:text-slate-800 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
