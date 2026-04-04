import React from 'react';
import { useNotificationStore } from '../store/notificationStore';
import { Check, Mail, Bell, Droplets, Flame, X } from 'lucide-react';

const NotificationFeed = ({ onClose }) => {
  const { notifications, markAsRead, markAllAsRead, clearNotifications } = useNotificationStore();

  return (
    <div className="absolute top-14 right-0 w-80 md:w-96 max-h-[75vh] bg-white/95 dark:bg-slate-900/95 backdrop-blur-3xl border border-white/60 dark:border-white/10 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden text-slate-800 dark:text-slate-200">

      <div className="p-4 border-b border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <Mail size={18} className="text-indigo-500 dark:text-cyan-400" />
          Worker Mails
        </h3>
        <div className="flex gap-3 items-center">
          <button onClick={markAllAsRead} className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-cyan-400 hover:underline">
            Mark read
          </button>
          <button onClick={onClose} className="p-1 rounded-md text-slate-400 hover:text-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition">
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 scroll-smooth">
        {notifications.length === 0 ? (
          <div className="py-10 text-center text-slate-400 flex flex-col items-center">
            <Bell size={28} className="opacity-30 mb-2" />
            <p className="text-sm font-semibold">No severe weather alerts.</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className={`mb-3 p-4 rounded-xl transition-all border ${notif.read
                  ? 'bg-slate-50/50 text-slate-500 dark:bg-slate-800/30 border-transparent opacity-80'
                  : 'bg-white dark:bg-slate-800 border-indigo-100 dark:border-white/10 shadow-sm'
                }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-md ${notif.riskType.includes('Heat') ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'}`}>
                    {notif.riskType.includes('Heat') ? <Flame size={14} /> : <Droplets size={14} />}
                  </div>
                  <span className="font-extrabold text-[13px] tracking-tight">To: {notif.workerName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400">{new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  {!notif.read && (
                    <button onClick={() => markAsRead(notif.id)} className="text-slate-400 hover:text-indigo-500 dark:hover:text-cyan-400 transition" title="Mark as read">
                      <Check size={16} />
                    </button>
                  )}
                </div>
              </div>
              <p className={`text-xs leading-relaxed font-semibold ${notif.read ? 'text-slate-500 dark:text-slate-400' : 'text-slate-700 dark:text-slate-200'}`}>
                {notif.message}
              </p>
              <div className="mt-3 flex gap-2">
                <span className="text-[10px] bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-slate-500 dark:text-slate-300 font-bold uppercase tracking-wider flex items-center gap-1">
                  {notif.location} • {notif.temperature}°C
                </span>
                <span className="text-[10px] bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded text-indigo-600 dark:text-cyan-400 font-extrabold uppercase tracking-wider">
                  Alert Triggered
                </span>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default NotificationFeed;
