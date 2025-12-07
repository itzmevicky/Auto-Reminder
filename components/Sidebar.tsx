import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  CalendarClock, 
  Inbox, 
  BarChart3, 
  CreditCard, 
  LogOut,
  X,
  Zap
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen, onClose }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'contacts', label: 'Customers', icon: Users },
    { id: 'templates', label: 'Templates', icon: MessageSquare },
    { id: 'automation', label: 'Automation', icon: CalendarClock },
    { id: 'inbox', label: 'Inbox', icon: Inbox, badge: 3 },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ];

  return (
    <>
      <aside 
        className={`fixed top-0 left-0 z-40 h-full w-72 bg-[#0F172A] text-slate-300 flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] shadow-2xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header Area */}


        {/* Navigation Links */}
        <nav className="flex-1 py-8 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          <div className="px-4 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Menu</div>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-4 py-3.5 rounded-xl transition-all relative group
                  ${isActive 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20 font-medium' 
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                  }`}
              >
                <Icon size={20} className={`shrink-0 transition-colors ${isActive ? 'text-indigo-100' : 'group-hover:text-white'}`} strokeWidth={isActive ? 2.5 : 2} />
                <span className="ml-3.5 tracking-wide">{item.label}</span>
                {item.badge && (
                  <span className={`absolute right-4 text-[10px] font-bold px-2 py-0.5 rounded-full ${isActive ? 'bg-white text-indigo-600' : 'bg-indigo-500 text-white'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer / Pro Card */}
        <div className="p-6 mt-auto">
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-4 border border-indigo-500/30 relative overflow-hidden group mb-4">
             <div className="absolute top-0 right-0 p-8 bg-indigo-500/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-500/30 transition-colors"></div>
             <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2 text-indigo-300 font-semibold text-xs uppercase tracking-wider">
                  <Zap size={14} fill="currentColor" /> Pro Plan
                </div>
                <p className="text-white text-sm font-medium mb-3">Upgrade for more AI features</p>
                <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-colors shadow-lg shadow-indigo-900/20">
                  Upgrade Now
                </button>
             </div>
          </div>

          <button className="w-full flex items-center px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors">
            <LogOut size={20} className="shrink-0" />
            <span className="ml-3 font-medium">Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};