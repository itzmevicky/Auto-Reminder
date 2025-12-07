import React, { useEffect, useState } from 'react';
import { CreditCard, Check, Shield, Zap, Star } from 'lucide-react';
import { BillingInfo } from '../types';
import { api } from '../services/api';

export const Billing: React.FC = () => {
  const [info, setInfo] = useState<BillingInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBilling = async () => {
      try {
        const data = await api.getBillingInfo();
        setInfo(data);
      } catch (e) {
        console.error("Failed to load billing");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBilling();
  }, []);

  if (isLoading || !info) {
    return (
        <div className="space-y-8 w-full animate-pulse">
            <div className="h-8 w-48 bg-slate-200 rounded"></div>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2 h-64 bg-slate-200 rounded-3xl"></div>
                <div className="h-64 bg-slate-200 rounded-3xl"></div>
            </div>
        </div>
    );
  }

  return (
    <div className="space-y-8 w-full">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Billing & Plans</h2>
        <p className="text-slate-500 text-lg mt-1">Manage your subscription and payment methods.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Current Plan Card - Realistic Dark Card Effect */}
        <div className="xl:col-span-2 relative overflow-hidden rounded-3xl p-1 bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl">
          <div className="absolute top-0 right-0 p-40 bg-indigo-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 p-32 bg-purple-500/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>
          
          <div className="bg-[#0F172A]/80 backdrop-blur-xl h-full rounded-[20px] p-8 md:p-10 flex flex-col md:flex-row justify-between relative z-10">
             <div className="flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-4 border border-indigo-500/30 shadow-lg shadow-indigo-900/20">
                    <Star size={12} fill="currentColor" /> {info.plan}
                  </div>
                  <h3 className="text-4xl font-bold text-white tracking-tight mb-2">Active Subscription</h3>
                  <p className="text-slate-400 font-medium">Your next billing date is <span className="text-white">{info.nextBillingDate}</span></p>
                </div>
                <div className="mt-8 md:mt-0">
                  <button className="bg-white hover:bg-slate-50 text-slate-900 px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                    Manage Subscription
                  </button>
                </div>
             </div>
             
             <div className="mt-8 md:mt-0 flex flex-col items-end justify-center">
               <div className="text-right">
                  <span className="text-5xl font-bold text-white tracking-tight">${info.amount}</span>
                  <span className="text-xl text-slate-400 font-normal">/{info.interval}</span>
               </div>
               <div className="mt-2 text-right text-sm text-slate-400 font-medium">
                  Billed monthly
               </div>
             </div>
          </div>
        </div>

        {/* Payment Method Card */}
        <div className="bg-white p-8 rounded-3xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col h-full">
           <div className="flex items-center gap-4 mb-8">
             <div className="p-3 bg-slate-900 text-white rounded-xl shadow-md">
               <CreditCard size={24} />
             </div>
             <div>
                <h3 className="font-bold text-slate-900 text-lg">Payment Method</h3>
                <p className="text-slate-500 text-sm">Update your billing details</p>
             </div>
           </div>
           
           {/* Credit Card Visual */}
           <div className="bg-gradient-to-br from-slate-700 to-slate-900 rounded-2xl p-6 text-white mb-6 relative overflow-hidden shadow-lg transform transition-transform hover:scale-[1.02] duration-300">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
             <div className="flex justify-between items-start mb-8">
                <div className="w-12 h-8 bg-white/20 rounded-md backdrop-blur-sm"></div>
                <span className="font-mono text-lg font-bold italic opacity-80">{info.paymentMethod.brand}</span>
             </div>
             <div className="space-y-4">
                <div className="font-mono text-xl tracking-widest text-shadow-sm">•••• •••• •••• {info.paymentMethod.last4}</div>
                <div className="flex justify-between items-end">
                    <div className="text-xs uppercase opacity-70 font-semibold tracking-wider">Card Holder<br/><span className="text-sm text-white opacity-100 normal-case">{info.paymentMethod.holder}</span></div>
                    <div className="text-xs uppercase opacity-70 font-semibold tracking-wider">Expires<br/><span className="text-sm text-white opacity-100 normal-case">{info.paymentMethod.expiry}</span></div>
                </div>
             </div>
           </div>

           <button className="w-full mt-auto py-3 border border-slate-200 rounded-xl text-slate-600 font-bold hover:border-slate-300 hover:bg-slate-50 transition-all">
             + Add New Method
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Business Profile */}
        <div className="bg-white p-8 rounded-3xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] border border-slate-100">
          <div className="flex items-center gap-4 mb-6">
             <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
               <Shield size={24} />
             </div>
             <div>
                <h3 className="font-bold text-slate-900 text-lg">Business Profile</h3>
                <p className="text-slate-500 text-sm">Company information on invoices</p>
             </div>
           </div>

           <div className="space-y-5">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Company Name</label>
                    <input type="text" value={info.company.name} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" readOnly />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Tax ID</label>
                    <input type="text" value={info.company.taxId} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" readOnly />
                </div>
             </div>
             <div>
               <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Billing Address</label>
               <input type="text" value={info.company.address} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" readOnly />
             </div>
           </div>
        </div>

        {/* Feature List */}
        <div className="bg-indigo-50 rounded-3xl p-8 border border-indigo-100">
          <div className="flex items-center gap-3 mb-6">
            <Zap size={24} className="text-indigo-600" fill="currentColor" />
            <h3 className="font-bold text-indigo-900 text-lg">Included in Pro</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
            {['Unlimited Contacts', 'Advanced Automation', 'AI Message Generator', 'Team Inbox (up to 3)', 'Priority Support', 'API Access', 'Custom Reports', 'Data Export'].map((feature) => (
              <div key={feature} className="flex items-center gap-3 text-indigo-800 font-medium text-sm">
                <div className="p-1 bg-white rounded-full shadow-sm">
                    <Check size={12} className="text-indigo-600" strokeWidth={3} />
                </div>
                {feature}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
