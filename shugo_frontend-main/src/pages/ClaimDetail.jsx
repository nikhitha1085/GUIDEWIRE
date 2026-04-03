import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, XCircle, Zap, ShieldCheck } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';

const ClaimDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const claim = {
    id: id || 'CLM-4002',
    date: '10 Mar 2026',
    amount: '₹5,000',
    type: 'Extreme Weather',
    status: 'Approved',
    description: 'Heavy rainfall flooded the area, preventing work for 4 days.',
    autoApproved: true,
  };

  const triggers = [
    { name: 'Weather Data API', result: true, detail: 'Rainfall > 50mm detected in district' },
    { name: 'Flood Zone Check', result: true, detail: 'Location verified in high-risk zone' },
    { name: 'Accident Registry', result: false, detail: 'No local hospital admission found' },
    { name: 'Income Gap Analysis', result: false, detail: 'Not applicable for this claim type' },
    { name: 'Government Disruption Notice', result: false, detail: 'No official curfew/halt declared' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <button 
        onClick={() => navigate('/claims')}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4 group font-medium px-2"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        Back to Claims
      </button>

      <div className="glass-panel-dark rounded-[2rem] p-6 md:p-10 relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        
        {claim.autoApproved && claim.status === 'Approved' && (
          <div className="absolute top-0 left-0 w-full bg-emerald-500/10 backdrop-blur-md border-b border-emerald-500/20 text-emerald-300 py-3 px-6 flex items-center justify-center gap-2 font-bold tracking-wide text-sm shadow-md">
            <Zap size={18} className="text-yellow-400" />
            Auto Approved — Payout Initiated
          </div>
        )}

        <div className={`flex flex-col md:flex-row justify-between items-start gap-6 ${claim.autoApproved ? 'mt-10' : ''}`}>
          <div>
            <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">{claim.id}</h1>
            <p className="text-slate-400 flex items-center gap-2 font-light">
              Filed on {claim.date} <span className="text-white/20">•</span> <span className="text-indigo-400 font-semibold">{claim.type}</span>
            </p>
          </div>
          <div className="flex flex-col items-end gap-3">
            <p className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">{claim.amount}</p>
            <StatusBadge status={claim.status} />
          </div>
        </div>

        <div className="my-10">
          <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2 tracking-wide">
            <ShieldCheck className="text-indigo-400" size={22} />
            Claim Description
          </h3>
          <p className="text-slate-300 bg-white/5 p-6 rounded-2xl border border-white/10 leading-relaxed font-medium shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
            {claim.description}
          </p>
        </div>

        <div>
          <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Oracle Triggers & Results</h3>
          <p className="text-sm text-slate-400 mb-8 font-light">Our system automatically checks multiple data sources to verify your claim instantly.</p>
          
          <div className="space-y-4">
            {triggers.map((trigger, idx) => (
              <div 
                key={idx} 
                className={`flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl border transition-all duration-300 shadow-sm ${
                  trigger.result 
                    ? 'glass-panel border-emerald-500/30 hover:border-emerald-500/50' 
                    : 'bg-white/5 border-white/5 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-4 mb-3 md:mb-0">
                  {trigger.result ? (
                    <div className="bg-emerald-500/20 text-emerald-400 p-2.5 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                      <CheckCircle2 size={22} />
                    </div>
                  ) : (
                    <div className="bg-white/5 text-slate-500 p-2.5 rounded-xl">
                      <XCircle size={22} />
                    </div>
                  )}
                  <div>
                    <h4 className={`font-bold tracking-wide ${trigger.result ? 'text-white' : 'text-slate-400'}`}>
                      {trigger.name}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 font-medium">{trigger.detail}</p>
                  </div>
                </div>
                
                <div className="md:text-right ml-16 md:ml-0">
                  <span className={`text-xs font-bold tracking-wider uppercase px-4 py-1.5 rounded-lg border ${
                    trigger.result 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[inset_0_1px_1px_rgba(16,185,129,0.3)]' 
                      : 'bg-slate-900/50 text-slate-500 border-slate-700/50'
                  }`}>
                    {trigger.result ? 'Trigger Fired' : 'Did Not Fire'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimDetail;
