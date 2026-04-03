import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Shield, ArrowRight, UserPlus, Compass } from 'lucide-react';

const Homepage = () => {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Liquid UI Dark Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/40 blur-[150px] pointer-events-none animate-pulse" style={{animationDuration: '8s'}} />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/40 blur-[150px] pointer-events-none animate-pulse" style={{animationDuration: '10s'}} />
      
      <div className="glass-panel w-full max-w-2xl rounded-3xl p-10 md:p-14 relative z-10 text-center flex flex-col items-center">
        <div className="w-20 h-20 mb-8 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-[0_0_40px_rgba(79,70,229,0.4)] transform hover:scale-105 transition-transform duration-500">
          <Shield size={40} className="text-white drop-shadow-md" />
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 tracking-tight mb-4 drop-shadow-sm">
          Protect Your Worker
        </h1>
        
        <p className="text-slate-400 text-lg md:text-xl font-light mb-12 max-w-md mx-auto leading-relaxed">
          The automated insurance platform. Experience the demo instantly or log in to seamlessly manage policies.
        </p>

        <div className="flex flex-col w-full max-w-md gap-4">
          <Link 
            to="/dashboard"
            className="w-full px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-lg transition-all flex items-center justify-center gap-3 group backdrop-blur-md"
          >
            <Compass size={22} className="group-hover:rotate-45 transition-transform duration-500" />
            Explore Dashboard (Demo)
          </Link>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link 
              to="/login"
              className="w-full px-6 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold shadow-[0_4px_20px_rgba(79,70,229,0.4)] transition-all flex items-center justify-center gap-2 group"
            >
              Log In
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link 
              to="/register"
              className="w-full px-6 py-4 rounded-2xl glass-input border border-white/10 hover:border-white/30 text-white font-semibold transition-all flex items-center justify-center gap-2 group"
            >
              Register
              <UserPlus size={18} className="group-hover:scale-110 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
