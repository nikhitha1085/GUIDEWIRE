import React, { useState } from 'react';
import { Shield, Plus, Lock } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import { useAuthStore } from '../store/authStore';

const Policy = () => {
  const { isAuthenticated } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [coverageType, setCoverageType] = useState('basic');

  const policies = [
    {
      id: 'POL-9002',
      type: 'Standard Protection',
      startDate: '01 Jan 2026',
      endDate: '31 Dec 2026',
      status: 'Active',
      premium: '₹50/week'
    },
    {
      id: 'POL-8011',
      type: 'Basic Protection',
      startDate: '01 Jan 2025',
      endDate: '31 Dec 2025',
      status: 'Expired',
      premium: '₹30/week'
    },
    {
      id: 'POL-7543',
      type: 'Premium Protection',
      startDate: '15 Mar 2024',
      endDate: '10 Aug 2024',
      status: 'Cancelled',
      premium: '₹80/week'
    }
  ];

  const handleCreatePolicy = (e) => {
    e.preventDefault();
    if (!isAuthenticated) return;
    setIsModalOpen(false);
    alert(`Successfully created ${coverageType} policy!`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight mb-1">My Policies</h1>
          <p className="text-slate-400 font-light">Manage your insurance coverage and renewals.</p>
        </div>
        <button 
          onClick={() => isAuthenticated ? setIsModalOpen(true) : null}
          className={`px-6 py-3.5 rounded-2xl font-semibold shadow-[0_4px_20px_rgba(34,211,238,0.2)] transition-all flex items-center justify-center gap-2
          ${isAuthenticated 
            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white cursor-pointer' 
            : 'bg-white/5 border border-white/10 text-slate-500 cursor-not-allowed'}`}
          title={!isAuthenticated ? "Login required to perform actions" : ""}
        >
          {isAuthenticated ? <Plus size={20} /> : <Lock size={18} />}
          Get New Policy
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {policies.map((policy) => (
          <div key={policy.id} className="glass-panel p-6 md:p-8 rounded-3xl relative overflow-hidden flex flex-col h-full group hover:border-white/20 transition-colors">
            
            <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-blue-500/10 blur-3xl pointer-events-none group-hover:bg-blue-500/20 transition-colors" />

            <div className="flex justify-between items-start mb-8 relative z-10">
              <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-cyan-400 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                <Shield size={28} />
              </div>
              <StatusBadge status={policy.status} />
            </div>

            <h3 className="text-xl font-bold text-white tracking-wide mb-1 relative z-10">{policy.type}</h3>
            <p className="text-slate-500 font-mono text-sm mb-8 relative z-10 tracking-widest">{policy.id}</p>

            <div className="space-y-4 mb-10 flex-1 relative z-10">
              <div className="flex justify-between items-center text-sm border-b border-white/5 pb-3">
                <span className="text-slate-400 font-medium">Premium</span>
                <span className="text-white font-bold">{policy.premium}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-white/5 pb-3">
                <span className="text-slate-400 font-medium">Valid From</span>
                <span className="text-slate-200">{policy.startDate}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-white/5 pb-3">
                <span className="text-slate-400 font-medium">Valid Till</span>
                <span className="text-slate-200">{policy.endDate}</span>
              </div>
            </div>

            <div className="flex gap-4 mt-auto relative z-10">
              {policy.status === 'Active' ? (
                <button 
                  disabled={!isAuthenticated}
                  title={!isAuthenticated ? "Login required to perform actions" : ""}
                  className={`flex-1 py-3.5 rounded-2xl font-semibold transition-all border ${
                    isAuthenticated 
                      ? 'bg-white/5 hover:bg-white/10 text-white border-white/10' 
                      : 'bg-white/5 text-slate-500 border-transparent cursor-not-allowed'
                  }`}
                >
                  Cancel Auto-Renew
                </button>
              ) : policy.status === 'Expired' ? (
                <button 
                  disabled={!isAuthenticated}
                  title={!isAuthenticated ? "Login required to perform actions" : ""}
                  className={`flex-1 py-3.5 rounded-2xl font-bold transition-all shadow-[0_4px_15px_rgba(16,185,129,0.2)] ${
                    isAuthenticated 
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white' 
                      : 'bg-white/5 border border-white/10 text-slate-500 cursor-not-allowed shadow-none'
                  }`}
                >
                  Renew Now
                </button>
              ) : (
                <button disabled className="flex-1 bg-white/5 text-slate-600 py-3.5 rounded-2xl font-semibold border border-white/5 cursor-not-allowed">
                  Cancelled
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Policy">
        <form onSubmit={handleCreatePolicy} className="space-y-6">
          <div className="space-y-4">
            <label className="flex items-center gap-4 p-5 glass-input rounded-2xl cursor-pointer hover:bg-white/10 transition-colors border border-white/10 focus-within:border-cyan-500">
              <input 
                type="radio" 
                name="coverage" 
                value="basic"
                checked={coverageType === 'basic'}
                onChange={(e) => setCoverageType(e.target.value)}
                className="w-5 h-5 accent-cyan-500" 
              />
              <div>
                <h4 className="font-bold text-white tracking-wide">Basic Protection</h4>
                <p className="text-xs text-slate-400 mt-1">Accident & Health cover only. ₹30/week.</p>
              </div>
            </label>
            
            <label className="flex items-center gap-4 p-5 glass-input rounded-2xl cursor-pointer hover:bg-white/10 transition-colors border border-white/10 focus-within:border-cyan-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-10"><Shield size={40} /></div>
              <input 
                type="radio" 
                name="coverage" 
                value="standard"
                checked={coverageType === 'standard'}
                onChange={(e) => setCoverageType(e.target.value)}
                className="w-5 h-5 accent-cyan-500" 
              />
              <div className="relative z-10">
                <h4 className="font-bold text-white flex items-center gap-2 tracking-wide">
                  Standard Protection
                  <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">Recommended</span>
                </h4>
                <p className="text-xs text-slate-400 mt-1">Includes Weather & Govt Disruption. ₹50/week.</p>
              </div>
            </label>

            <label className="flex items-center gap-4 p-5 glass-input rounded-2xl cursor-pointer hover:bg-white/10 transition-colors border border-white/10 focus-within:border-cyan-500">
              <input 
                type="radio" 
                name="coverage" 
                value="premium"
                checked={coverageType === 'premium'}
                onChange={(e) => setCoverageType(e.target.value)}
                className="w-5 h-5 accent-cyan-500" 
              />
              <div>
                <h4 className="font-bold text-white tracking-wide">Premium Protection</h4>
                <p className="text-xs text-slate-400 mt-1">All triggers + Income Gap Cover. ₹80/week.</p>
              </div>
            </label>
          </div>

          <button type="submit" className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white py-4 rounded-2xl font-bold transition-colors shadow-lg">
            Confirm & Pay First Week
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Policy;
