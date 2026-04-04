import React from 'react';

const StatusBadge = ({ status }) => {
  const getStyles = () => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'approved':
      case 'completed':
        return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30';
      case 'expired':
      case 'rejected':
      case 'cancelled':
        return 'bg-rose-500/20 text-rose-300 border border-rose-500/30';
      case 'pending':
      case 'reviewing':
        return 'bg-amber-500/20 text-amber-300 border border-amber-500/30';
      default:
        return 'bg-slate-500/20 text-slate-300 border border-slate-500/30';
    }
  };

  return (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wider backdrop-blur-sm ${getStyles()}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
