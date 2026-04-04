import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Plus, ChevronRight, Lock } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import { useAuthStore } from '../store/authStore';

const Claims = () => {
  const { isAuthenticated } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newClaim, setNewClaim] = useState({ description: '', amount: '' });
  const navigate = useNavigate();

  const claims = [
    { id: 'CLM-4002', date: '10 Mar 2026', amount: '₹5,000', type: 'Extreme Weather', status: 'Approved' },
    { id: 'CLM-4003', date: '25 Mar 2026', amount: '₹2,000', type: 'Income Gap', status: 'Pending' },
    { id: 'CLM-3501', date: '12 Nov 2025', amount: '₹10,000', type: 'Accident Cover', status: 'Completed' },
    { id: 'CLM-2900', date: '05 Aug 2025', amount: '₹1,500', type: 'Govt Disruption', status: 'Rejected' },
  ];

  const handleFileClaim = (e) => {
    e.preventDefault();
    setIsModalOpen(false);
    alert('Claim filed successfully! It is now pending review.');
    setNewClaim({ description: '', amount: '' });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight mb-2">Claims History</h1>
          <p className="text-slate-400 font-light tracking-wide">View your past claims and file new ones.</p>
        </div>
        <button 
          onClick={() => isAuthenticated ? setIsModalOpen(true) : null}
          disabled={!isAuthenticated}
          title={!isAuthenticated ? "Login required to perform actions" : ""}
          className={`px-6 py-3.5 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(34,211,238,0.2)] ${
            isAuthenticated
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white cursor-pointer'
              : 'bg-white/5 border border-white/10 text-slate-500 cursor-not-allowed shadow-none'
          }`}
        >
          {isAuthenticated ? <Plus size={20} /> : <Lock size={18} />}
          File a Claim
        </button>
      </header>

      <div className="glass-panel-dark rounded-[2rem] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        {/* Mobile View */}
        <div className="md:hidden">
          {claims.map((claim) => (
            <div 
              key={claim.id} 
              onClick={() => navigate(`/claims/${claim.id}`)}
              className="p-6 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-bold text-white tracking-wide">{claim.id}</h4>
                  <p className="text-xs text-slate-400 mt-1">{claim.date}</p>
                </div>
                <StatusBadge status={claim.status} />
              </div>
              <div className="flex justify-between items-center mt-4 text-sm">
                <span className="text-slate-400 font-medium">{claim.type}</span>
                <span className="font-bold text-indigo-400">{claim.amount}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-slate-400 text-sm tracking-widest uppercase">
                <th className="p-6 font-semibold">Claim ID</th>
                <th className="p-6 font-semibold">Date Filed</th>
                <th className="p-6 font-semibold">Type</th>
                <th className="p-6 font-semibold">Amount</th>
                <th className="p-6 font-semibold">Status</th>
                <th className="p-6 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {claims.map((claim) => (
                <tr 
                  key={claim.id} 
                  className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group"
                  onClick={() => navigate(`/claims/${claim.id}`)}
                >
                  <td className="p-6 font-mono font-medium text-white tracking-wider">{claim.id}</td>
                  <td className="p-6 text-slate-300 font-light">{claim.date}</td>
                  <td className="p-6 text-slate-300 font-medium tracking-wide">{claim.type}</td>
                  <td className="p-6 font-bold text-indigo-400">{claim.amount}</td>
                  <td className="p-6"><StatusBadge status={claim.status} /></td>
                  <td className="p-6 text-right">
                    <button className="p-2 rounded-xl group-hover:bg-white/10 text-slate-500 group-hover:text-white transition-colors border border-transparent group-hover:border-white/10">
                      <ChevronRight size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="File a New Claim">
        <form onSubmit={handleFileClaim} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold tracking-wide text-slate-300 mb-2">Claim Description</label>
            <textarea 
              required
              value={newClaim.description}
              onChange={(e) => setNewClaim({ ...newClaim, description: e.target.value })}
              placeholder="Briefly describe what happened..."
              className="w-full p-4 rounded-2xl glass-input h-32 resize-none transition-all placeholder:text-slate-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold tracking-wide text-slate-300 mb-2">Estimated Amount (₹)</label>
            <input 
              type="number" 
              required
              value={newClaim.amount}
              onChange={(e) => setNewClaim({ ...newClaim, amount: e.target.value })}
              placeholder="e.g. 5000"
              className="w-full px-5 py-4 rounded-2xl glass-input transition-all placeholder:text-slate-500 font-medium"
            />
          </div>
          <div className="text-xs text-slate-400 flex items-start gap-3 bg-indigo-500/10 p-4 rounded-2xl mt-4 border border-indigo-500/20 backdrop-blur-sm">
            <AlertCircle size={18} className="flex-shrink-0 text-indigo-400" />
            <span className="leading-relaxed font-medium">Note: If you have a Standard or Premium policy, environmental triggers may automatically approve your claim instantly.</span>
          </div>
          <button type="submit" className="w-full mt-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white py-4 rounded-2xl font-extrabold transition-all shadow-[0_4px_20px_rgba(79,70,229,0.4)]">
            Submit Claim Verification
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Claims;
