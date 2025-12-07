import React, { useState, useEffect } from 'react';
import { Menu, Bell, Search } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Contacts } from './pages/Contacts';
import { Templates } from './pages/Templates';
import { Automation } from './pages/Automation';
import { Inbox } from './pages/Inbox';
import { Analytics } from './pages/Analytics';
import { Billing } from './pages/Billing';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Auto-collapse sidebar on mobile on initial load
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    // Set initial state
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard onNavigate={setActiveTab} />;
      case 'contacts': return <Contacts />;
      case 'templates': return <Templates />;
      case 'automation': return <Automation />;
      case 'inbox': return <Inbox />;
      case 'analytics': return <Analytics />;
      case 'billing': return <Billing />;
      default: return <Dashboard onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans text-slate-900">
      {/* Sidebar Component */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          // On mobile, close sidebar after selection
          if (window.innerWidth < 1024) setSidebarOpen(false);
        }} 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div 
        className={`flex-1 flex flex-col min-w-0 h-full transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] ${
          sidebarOpen ? 'lg:ml-72' : 'lg:ml-0'
        }`}
      >
        {/* Top Header */}
        <header className="h-20 shrink-0 px-6 lg:px-8 flex items-center justify-between z-10 sticky top-0 bg-[#F8FAFC]/80 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-xl text-slate-500 hover:bg-white hover:shadow-sm hover:text-slate-900 transition-all focus:outline-none"
              aria-label="Toggle Sidebar"
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-2 lg:hidden">
               <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/30">A</div>
            </div>
            {/* Breadcrumb-ish title */}
            <div className="hidden md:flex flex-col">
               <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Application</span>
               <h1 className="text-lg font-bold text-slate-900 capitalize leading-tight">
                {activeTab}
               </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
             {/* Search Bar - hidden on small mobile */}
             <div className="hidden md:flex items-center relative group">
                <Search className="absolute left-3 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="pl-10 pr-4 py-2 bg-white border border-transparent hover:border-slate-200 focus:border-indigo-500/50 rounded-full text-sm w-64 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm group-hover:shadow-md"
                />
             </div>

             <div className="flex items-center gap-3">
               <button className="p-2.5 rounded-full text-slate-400 hover:text-indigo-600 hover:bg-white hover:shadow-md transition-all relative">
                 <Bell size={20} />
                 <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#F8FAFC]"></span>
               </button>
               
               <div className="h-8 w-[1px] bg-slate-200 mx-1 hidden sm:block"></div>

               <div className="flex items-center gap-3 pl-1 cursor-pointer group">
                  <div className="text-right hidden sm:block">
                     <p className="text-sm font-bold text-slate-900 leading-none group-hover:text-indigo-600 transition-colors">Alex Morgan</p>
                     <p className="text-xs text-slate-400 font-medium">Owner</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-md overflow-hidden group-hover:ring-2 ring-indigo-500/50 transition-all">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="User" />
                  </div>
               </div>
             </div>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 pt-2 scroll-smooth">
          {renderContent()}
        </main>
      </div>
      
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default App;