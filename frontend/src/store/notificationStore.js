import { create } from 'zustand';

export const useNotificationStore = create((set) => ({
  notifications: [],
  unreadCount: 0,
  addNotification: (notification) => set((state) => {
    // Avoid spamming exact duplicate notifications within the last 30 minutes
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
