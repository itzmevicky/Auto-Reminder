import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, MoreVertical, Plus, Zap, Loader2, Play } from 'lucide-react';
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
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Campaign Scheduler</h2>
          <p className="text-slate-500 text-lg mt-1">Automate your customer follow-ups.</p>
        </div>
        <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 flex items-center gap-2 shadow-lg shadow-indigo-500/20 transition-all hover:-translate-y-0.5 font-medium">
          <Plus size={18} />
          Create New Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {isLoading ? (
            Array(3).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 h-32 animate-pulse border border-slate-100"></div>
            ))
        ) : (
          schedules.map((schedule) => (
            <div key={schedule.id} className={`bg-white rounded-2xl shadow-sm border p-6 flex flex-col md:flex-row items-center justify-between gap-6 transition-all group hover:shadow-md ${schedule.active ? 'border-indigo-100' : 'border-slate-100 opacity-75'}`}>
              
              <div className="flex items-center gap-6 w-full md:w-auto">
                 {/* Visual Icon Box */}
                 <div className={`w-20 h-20 rounded-2xl flex flex-col items-center justify-center shrink-0 shadow-sm border ${schedule.active ? 'bg-indigo-50 border-indigo-100 text-indigo-600' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                    <span className="text-2xl font-bold">{schedule.time.split(':')[0]}</span>
                    <span className="text-xs uppercase font-bold tracking-wider">{schedule.time.includes('PM') || parseInt(schedule.time) > 11 ? 'PM' : 'AM'}</span>
                 </div>
                 
                 <div>
                    <h3 className="font-bold text-xl text-slate-900 tracking-tight">{schedule.name}</h3>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-sm">
                       <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 font-bold text-xs uppercase tracking-wide">
                          {schedule.frequency}
                       </span>
                       <span className="text-slate-400 font-medium">to</span>
                       <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 font-medium border border-indigo-100">
                          <Users size={14} />
                          {schedule.targetGroup}
                       </span>
                    </div>
                    {schedule.days && (
                       <p className="text-sm text-slate-400 mt-2 font-medium">Runs on: <span className="text-slate-600">{schedule.days.join(', ')}</span></p>
                    )}
                 </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-slate-100 pt-4 md:pt-0">
                <div className="text-right hidden md:block">
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Status</p>
                   <p className={`font-bold ${schedule.active ? 'text-emerald-600' : 'text-slate-400'}`}>{schedule.active ? 'Running' : 'Paused'}</p>
                </div>
                
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => handleToggle(schedule.id, schedule.active)}
                    disabled={togglingId === schedule.id}
                    className={`h-10 px-4 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${
                        schedule.active 
                        ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' 
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200'
                    }`}
                  >
                     {togglingId === schedule.id ? <Loader2 size={16} className="animate-spin"/> : (schedule.active ? 'Pause' : <><Play size={16} fill="currentColor"/> Activate</>)}
                  </button>
                  <button className="text-slate-300 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                    <MoreVertical size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};