import React from 'react';

const GlassCard = ({ children, className = '', highlightColor = 'blue', noPadding = false }) => {
  const highlightMap = {
    blue: 'group-hover:bg-blue-300/40 dark:group-hover:bg-blue-500/10',
    cyan: 'group-hover:bg-cyan-300/40 dark:group-hover:bg-cyan-500/10',
    purple: 'group-hover:bg-purple-300/40 dark:group-hover:bg-purple-500/10',
    emerald: 'group-hover:bg-emerald-300/40 dark:group-hover:bg-emerald-500/10',
    indigo: 'group-hover:bg-indigo-300/40 dark:group-hover:bg-indigo-500/10',
  };

  return (
    <div className={`relative group overflow-hidden rounded-[2rem] border border-white/80 dark:border-white/10 bg-white/40 dark:bg-white/5 backdrop-blur-3xl shadow-[0_8px_32px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.37)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_16px_40px_rgba(0,0,0,0.5)] hover:bg-white/50 dark:hover:border-white/20 ${className}`}>
      {/* Dynamic Inner Highlight */}
      <div className={`absolute -inset-px rounded-[2rem] bg-gradient-to-b from-white/70 dark:from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
      
      {/* Dark Mode Texture Overlay */}
      <div className="absolute inset-0 opacity-0 dark:opacity-[0.03] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      {/* Background Soft Glow */}
      <div className={`absolute -top-32 -right-32 w-64 h-64 blur-[80px] rounded-full transition-colors duration-700 pointer-events-none ${highlightMap[highlightColor]} opacity-0 group-hover:opacity-100`} />
      
      <div className={`relative z-10 ${noPadding ? '' : 'p-6 md:p-8'}`}>
        {children}
      </div>
    </div>
  );
};

export default GlassCard;
