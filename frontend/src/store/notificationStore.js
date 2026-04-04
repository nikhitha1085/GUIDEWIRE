import { create } from 'zustand';

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  
  startPolling: () => {
    // Poll backend every 10 seconds for new alerts
    setInterval(async () => {
      try {
        const res = await fetch('http://localhost:5000/api/weather/notifications');
        if (!res.ok) throw new Error('Failed to fetch notifications');
        const data = await res.json();
        
        // We replace or merge. Since backend sends latest 100, we can just replace everything and calculate unread count
        // Or properly merge. For simplicity, we just replace and keep unreadCount relative to what we marked as read.
        
        set((state) => {
          // If we want to strictly keep unread status, we should merge.
          const currentIds = new Set(state.notifications.map(n => n.id));
          const newNotifications = data.notifications.filter(n => !currentIds.has(n.id));
          
          if (newNotifications.length === 0) return state; // No changes

          return {
            notifications: [...newNotifications, ...state.notifications],
            unreadCount: state.unreadCount + newNotifications.length
          };
        });
      } catch (err) {
        console.error("Failed to poll backend notifications", err);
      }
    }, 10000); // 10 seconds
  },

  addNotification: (notification) => set((state) => {
    // Left for manual local additions if any
    const isDuplicate = state.notifications.some(
      n => n.workerId === notification.workerId && n.riskType === notification.riskType && (Date.now() - n.timestamp < 30 * 60 * 1000)
    );
    if (isDuplicate) return state;

    return {
      notifications: [{ ...notification, id: Date.now().toString(), read: false, timestamp: Date.now() }, ...state.notifications],
      unreadCount: state.unreadCount + 1
    };
  }),
  
  markAsRead: (id) => set((state) => ({
    notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n),
    unreadCount: Math.max(0, state.unreadCount - 1)
  })),
  
  markAllAsRead: () => set((state) => ({
    notifications: state.notifications.map(n => ({ ...n, read: true })),
    unreadCount: 0
  })),
  
  clearNotifications: () => set({ notifications: [], unreadCount: 0 })
}));

// Start polling
setTimeout(() => {
  useNotificationStore.getState().startPolling();
}, 2000);
