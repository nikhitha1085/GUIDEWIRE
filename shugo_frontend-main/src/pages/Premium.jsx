import React, { useState } from 'react';
import { Calculator, CheckCircle, Info, ChevronDown, Lock } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const Premium = () => {
  const { isAuthenticated } = useAuthStore();
  const [selectedPolicy, setSelectedPolicy] = useState('Standard Protection');

  const policies = [
    { id: 'POL-9002', name: 'Standard Protection' },
    { id: 'POL-8011', name: 'Basic Protection' }
  ];

  const breakdown = {
    base: 30,
    zoneRisk: 10,
    weatherRisk: 10,
    adjustment: -2,
    final: 48
  };

  const activeStr = selectedPolicy === 'Standard Protection';

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="mb-4">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight mb-2">Premium Calculation</h1>
        <p className="text-slate-400 font-light tracking-wide">See exactly how your weekly premium is structured.</p>
      </header>

      <div className="glass-panel-dark rounded-[2rem] p-6 md:p-10 relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[40%] bg-blue-500/20 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-purple-500/20 blur-[100px] pointer-events-none" />

        <div className="relative z-10">
          <label className="block text-sm font-semibold text-slate-400 mb-3 tracking-wide">Select Policy Data</label>
          <div className="relative mb-10">
            <select 
              value={selectedPolicy}
              onChange={(e) => setSelectedPolicy(e.target.value)}
              className="w-full pl-6 pr-10 py-4 rounded-2xl glass-input appearance-none text-white font-semibold cursor-pointer tracking-wide border-white/20"
            >
              {policies.map(p => (
                <option key={p.id} value={p.name} className="text-slate-900 bg-slate-200">
                  {p.id} — {p.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-6 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
          </div>

          {activeStr ? (
            <div className="space-y-8">
              <div className="flex items-center gap-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 p-5 rounded-2xl backdrop-blur-md shadow-[0_4px_20px_rgba(16,185,129,0.1)]">
                <CheckCircle size={24} className="text-emerald-400 flex-shrink-0" />
                <p className="font-semibold text-sm tracking-wide leading-relaxed">Low Risk Zone — <span className="text-white bg-emerald-500/30 px-2 py-0.5 rounded-md">₹2 discount</span> applied based on your registered location.</p>
              </div>

              <div className="p-8 rounded-[1.5rem] bg-white/5 border border-white/10 space-y-5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                <div className="flex justify-between items-center text-slate-300">
                  <span className="flex items-center gap-2 font-medium tracking-wide">Base Amount <Info size={14} className="text-slate-500 cursor-help" /></span>
                  <span className="font-semibold">₹{breakdown.base}</span>
                </div>
                
                <div className="flex justify-between items-center text-slate-300">
                  <span className="flex items-center gap-2 font-medium tracking-wide">Zone Risk <Info size={14} className="text-slate-500 cursor-help" /></span>
                  <span className="font-semibold text-amber-300">+ ₹{breakdown.zoneRisk}</span>
                </div>

                <div className="flex justify-between items-center text-slate-300">
                  <span className="flex items-center gap-2 font-medium tracking-wide">Weather Risk <Info size={14} className="text-slate-500 cursor-help" /></span>
                  <span className="font-semibold text-amber-300">+ ₹{breakdown.weatherRisk}</span>
                </div>

                <div className="flex justify-between items-center text-emerald-400">
                  <span className="font-medium tracking-wide">Safe Area Adjustment</span>
                  <span className="font-bold">- ₹{Math.abs(breakdown.adjustment)}</span>
                </div>
                
                <div className="w-full h-px bg-white/10 my-6" />

                <div className="flex justify-between items-center text-2xl font-bold tracking-tight">
                  <span className="text-white">Final Weekly Premium</span>
                  <span className="text-blue-400">₹{breakdown.final}</span>
                </div>
              </div>

              <button 
                title={!isAuthenticated ? "Login required to perform actions" : ""}
                disabled={!isAuthenticated}
                className={`w-full py-5 rounded-2xl font-extrabold flex items-center justify-center gap-3 transition-all duration-300 ${
                  isAuthenticated
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-[0_4px_20px_rgba(79,70,229,0.4)] hover:shadow-[0_4px_25px_rgba(79,70,229,0.5)]'
                    : 'bg-white/5 border border-white/10 text-slate-500 cursor-not-allowed shadow-none'
                }`}
              >
                {isAuthenticated ? <Calculator size={22} /> : <Lock size={20} />}
                Pay ₹{breakdown.final} Now
              </button>
            </div>
          ) : (
            <div className="p-10 text-center text-slate-400 border border-dashed border-white/10 rounded-[1.5rem] bg-white/5">
              <p className="font-medium tracking-wide">Select an active policy to view premium breakdown.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Premium;
