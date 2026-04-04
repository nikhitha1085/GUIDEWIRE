import React, { useState } from 'react';
import WeatherWidget from './WeatherWidget';
import { Bell } from 'lucide-react';
import NotificationFeed from './NotificationFeed';
import { useNotificationStore } from '../store/notificationStore';
import { useWorkerStore } from '../store/workerStore';

const NavBar = () => {
  const [showFeed, setShowFeed] = useState(false);
  const { unreadCount } = useNotificationStore();
  
  // Implicitly load and keep worker store active
  useWorkerStore();

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/70 dark:bg-slate-950/60 border-b border-white/60 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.02)] px-6 py-3.5 flex items-center justify-between transition-all">
      <div className="flex items-center gap-2">
        <h2 className="hidden sm:block font-bold text-lg text-slate-800 dark:text-white tracking-tight">Overview</h2>
      </div>
      
      <div className="flex items-center gap-4 relative">
        <WeatherWidget />
        <button 
          onClick={() => setShowFeed(!showFeed)}
          className="relative p-2.5 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-white/60 dark:border-white/10 text-slate-500 hover:text-indigo-600 dark:hover:text-cyan-400 hover:bg-white dark:hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 shadow-sm"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
             <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-extrabold text-white shadow-sm ring-[3px] ring-white dark:ring-slate-900 border-none transition-transform scale-110">
               {unreadCount}
             </span>
          )}
        </button>
        
        {showFeed && <NotificationFeed onClose={() => setShowFeed(false)} />}
      </div>
    </header>
  );
};

export default NavBar;
