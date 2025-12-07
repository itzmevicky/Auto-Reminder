import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, MoreHorizontal, Download, RefreshCcw } from 'lucide-react';
import { Contact } from '../types';
import { api } from '../services/api';

export const Contacts: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debounce search to simulate real API behavior
  useEffect(() => {
    const fetchContacts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await api.getContacts(searchTerm);
        setContacts(data);
      } catch (err) {
        setError('Failed to load contacts');
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(fetchContacts, 300);
    return () => clearTimeout(debounce);
  }, [searchTerm]);

  return (
    <div className="space-y-8 h-full flex flex-col w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Customers</h2>
          <p className="text-slate-500 text-lg mt-1">Manage your relationships and data.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 hover:border-slate-300 flex items-center gap-2 shadow-sm transition-all font-medium text-sm">
            <Download size={18} />
            Export
          </button>
          <button className="px-5 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 flex items-center gap-2 shadow-lg shadow-slate-200 transition-all hover:-translate-y-0.5 font-medium text-sm">
            <Plus size={18} />
            Add Contact
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-2 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center pl-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by name, phone, or tag..." 
            className="w-full pl-10 pr-4 py-2.5 bg-transparent border-none text-slate-800 placeholder:text-slate-400 focus:ring-0 text-sm font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 pr-2">
            <button className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors text-sm font-medium">
            <Filter size={18} />
            <span>Filter</span>
            </button>
        </div>
      </div>

      {/* Table Area */}
      <div className="bg-white rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden flex-1 relative min-h-[400px]">
        {error ? (
           <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
             <p className="mb-4">Something went wrong.</p>
             <button onClick={() => setSearchTerm('')} className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-medium transition-colors"><RefreshCcw size={16}/> Retry</button>
           </div>
        ) : isLoading ? (
          <div className="p-8 space-y-4">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="flex items-center gap-4 animate-pulse">
                <div className="w-10 h-10 bg-slate-100 rounded-full"></div>
                <div className="flex-1 space-y-2">
                   <div className="w-1/4 h-4 bg-slate-100 rounded"></div>
                   <div className="w-1/6 h-3 bg-slate-50 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="p-5 pl-8 font-semibold text-slate-500 text-xs uppercase tracking-wider">Name</th>
                  <th className="p-5 font-semibold text-slate-500 text-xs uppercase tracking-wider">Phone</th>
                  <th className="p-5 font-semibold text-slate-500 text-xs uppercase tracking-wider">Tags</th>
                  <th className="p-5 font-semibold text-slate-500 text-xs uppercase tracking-wider">Status</th>
                  <th className="p-5 pr-8 font-semibold text-slate-500 text-xs uppercase tracking-wider text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {contacts.length > 0 ? contacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="p-5 pl-8">
                      <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 text-indigo-700 flex items-center justify-center font-bold text-sm shadow-inner">
                              {contact.avatar || contact.name.charAt(0)}
                          </div>
                          <div>
                              <div className="font-semibold text-slate-900">{contact.name}</div>
                              {contact.notes && <div className="text-xs text-slate-400 truncate max-w-[150px]">{contact.notes}</div>}
                          </div>
                      </div>
                    </td>
                    <td className="p-5 text-slate-600 font-medium font-mono text-sm">{contact.phone}</td>
                    <td className="p-5">
                      <div className="flex gap-2 flex-wrap">
                        {contact.tags.map(tag => (
                          <span key={tag} className="px-2.5 py-1 bg-white border border-slate-200 text-slate-600 text-xs font-medium rounded-lg shadow-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        contact.status === 'active' 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${contact.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                        {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                      </span>
                    </td>
                    <td className="p-5 pr-8 text-right">
                      <button className="text-slate-300 hover:text-indigo-600 p-2 rounded-lg hover:bg-indigo-50 transition-all opacity-0 group-hover:opacity-100">
                        <MoreHorizontal size={20} />
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="p-16 text-center">
                       <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                          <Search size={32} />
                       </div>
                      <h3 className="text-slate-900 font-medium mb-1">No contacts found</h3>
                      <p className="text-slate-500 text-sm">Try adjusting your search.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
