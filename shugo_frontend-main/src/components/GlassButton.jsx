import React from 'react';

const GlassButton = ({ children, onClick, disabled, className = '', type = 'button', variant = 'primary' }) => {
  const baseClasses = "relative overflow-hidden rounded-full font-bold tracking-wide transition-all duration-300 flex items-center justify-center gap-2 group transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none";

  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-cyan-500 hover:from-blue-500 hover:to-indigo-500 dark:hover:from-blue-400 dark:hover:to-cyan-400 text-white shadow-[0_8px_20px_rgba(79,70,229,0.25)] dark:shadow-cyan-500/30 hover:shadow-[0_12px_25px_rgba(79,70,229,0.35)] outline-none focus:ring-4 focus:ring-indigo-500/30",
    secondary: "bg-white/60 dark:bg-white/10 hover:bg-white/80 dark:hover:bg-white/20 border border-white/80 dark:border-white/20 text-slate-800 dark:text-white backdrop-blur-xl shadow-[0_4px_15px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_15px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_8px_25px_rgba(0,0,0,0.4)]",
    danger: "bg-gradient-to-r from-rose-500 to-red-500 dark:from-rose-500 dark:to-red-600 hover:from-rose-400 hover:to-red-400 dark:hover:from-rose-400 dark:hover:to-red-500 text-white shadow-[0_8px_20px_rgba(244,63,94,0.25)] dark:shadow-[0_8px_20px_rgba(244,63,94,0.3)] hover:shadow-[0_12px_25px_rgba(244,63,94,0.35)]"
  };

  return (
    <button 
      type={type} 
      onClick={onClick} 
      disabled={disabled} 
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/40 dark:from-white/20 to-transparent opacity-60 dark:opacity-50 rounded-t-full pointer-events-none" />
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
    </button>
  );
};

export default GlassButton;
