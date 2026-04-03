import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Shield, Home, FileText, Calculator, AlertCircle, LogOut, Info, Sun, Moon } from 'lucide-react';
import GlassButton from './GlassButton';
import { useThemeStore } from '../store/themeStore';

const Layout = () => {
  const { logout, user, isAuthenticated } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <Home size={20} /> },
    { name: 'Policies', path: '/policy', icon: <FileText size={20} /> },
    { name: 'Premium', path: '/premium', icon: <Calculator size={20} /> },
    { name: 'Claims', path: '/claims', icon: <AlertCircle size={20} /> },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative overflow-hidden selection:bg-indigo-500/20 font-sans text-slate-800">
      
      {/* Light Glass Background Blobs */}
      <div className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-400/20 blur-[140px] pointer-events-none mix-blend-multiply" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-rose-300/20 blur-[140px] pointer-events-none mix-blend-multiply" />
      <div className="fixed top-[40%] left-[60%] w-[40vw] h-[40vw] rounded-full bg-cyan-300/20 blur-[140px] pointer-events-none mix-blend-multiply" />

      {/* Sidebar Apple Glass Panel */}
      <nav className="relative z-20 md:w-72 flex-shrink-0 flex flex-col bg-white/40 dark:bg-slate-950/40 backdrop-blur-3xl border-r border-white/60 dark:border-white/10 shadow-[8px_0_32px_rgba(0,0,0,0.02)] dark:shadow-[8px_0_32px_rgba(0,0,0,0.2)] md:h-screen sticky top-0 transition-all duration-500">
        
        <div className="p-8 flex items-center justify-between relative z-10 border-b border-white/40 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-2xl shadow-[0_8px_20px_rgba(99,102,241,0.25)] border border-white/50 dark:border-white/10 flex-shrink-0">
              <Shield className="text-white drop-shadow-md" size={24} />
            </div>
            <h1 className="font-extrabold text-xl leading-tight tracking-tight text-slate-900 dark:text-white drop-shadow-sm whitespace-nowrap">
              ProtectWorker
            </h1>
          </div>
          <button 
            onClick={toggleTheme}
            className="p-2 ml-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-yellow-400 hover:bg-white dark:hover:bg-white/10 hover:scale-110 active:scale-95 transition-all border border-slate-200 dark:border-white/10 shadow-sm"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden overflow-x-auto hide-scrollbar px-6 pb-6 gap-3 mt-6 border-b border-white/50 relative z-10">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
               <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-5 py-3 rounded-full whitespace-nowrap transition-all duration-300 font-semibold ${
                  isActive
                    ? 'bg-white/80 text-indigo-600 border border-white shadow-[0_4px_15px_rgba(0,0,0,0.05)] backdrop-blur-md'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-white/50 border border-transparent'
                }`}
              >
                {item.icon}
                <span className="text-sm">{item.name}</span>
              </Link>
            )
          })}
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-col h-full justify-between px-6 pb-8 mt-8 relative z-10">
          <div className="space-y-3">
            {navItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`group flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 ${
                    isActive
                      ? 'bg-white/70 dark:bg-white/10 text-indigo-600 dark:text-cyan-400 border border-white dark:border-white/20 shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2)] backdrop-blur-md'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-white/40 dark:hover:bg-white/5 border border-transparent hover:border-white/50 dark:hover:border-white/10 hover:scale-[1.02]'
                  }`}
                >
                  <div className={`transition-all duration-300 ${isActive ? 'text-indigo-500 dark:text-cyan-400 drop-shadow-[0_2px_8px_rgba(99,102,241,0.3)] dark:drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]' : 'group-hover:text-indigo-500 dark:group-hover:text-cyan-400 group-hover:scale-110'}`}>
                    {item.icon}
                  </div>
                  <span className="font-semibold tracking-wide">{item.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="mt-10">
            {isAuthenticated ? (
              <div className="bg-white/50 backdrop-blur-xl border border-white p-5 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
                <div className="flex items-center gap-3 mb-4 p-2 bg-slate-100/50 rounded-xl border border-white/60">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center font-bold text-white shadow-inner">
                    {user?.name?.charAt(0) || 'W'}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-extrabold text-slate-800 truncate">{user?.name || 'Worker User'}</p>
                    <p className="text-xs text-slate-500 truncate font-medium">{user?.phone || 'XXXXXXXXXX'}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-colors border border-transparent hover:border-rose-200 font-bold text-sm"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="bg-white/50 backdrop-blur-xl border border-white p-6 rounded-[2rem] text-center shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
                <Shield size={32} className="mx-auto mb-3 text-indigo-400 opacity-80 drop-shadow-md" />
                <p className="text-sm text-slate-600 font-semibold tracking-wide mb-5 leading-relaxed px-2">Access policies, premiums & claims securely.</p>
                <GlassButton 
                  onClick={() => navigate('/login')}
                  variant="secondary"
                  className="w-full py-3.5 text-sm"
                >
                  Sign In to Connect
                </GlassButton>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative z-10 pb-24 md:pb-0 scroll-smooth">
        {!isAuthenticated && (
          <div className="sticky top-0 z-30 bg-indigo-50/80 backdrop-blur-3xl border-b border-indigo-200/50 py-3 px-6 flex items-center justify-center gap-3 text-indigo-800 text-sm font-bold tracking-wide w-full shadow-sm">
            <Info size={18} className="text-indigo-600 animate-pulse" />
            VIEWING IN READ-ONLY DEMO MODE
          </div>
        )}
        <div className="p-6 md:p-12 lg:p-16 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
