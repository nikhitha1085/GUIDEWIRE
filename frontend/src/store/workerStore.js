import { create } from 'zustand';
import { useNotificationStore } from './notificationStore';

export const useWorkerStore = create((set, get) => ({
  workers: [],
  isSimulating: false,
  isFetching: false,
  
  startSimulation: () => {
    if (get().isSimulating) return;
    set({ isSimulating: true });
    
    // Initial fetch
    get().pollBackendWorkers();
    
    // Simulate real-time GPS checking by fetching from backend every 1 minute
    const intervalId = setInterval(() => {
      get().pollBackendWorkers();
    }, 60 * 1000);
    
    window.__workerSimulationInterval = intervalId;
  },

  pollBackendWorkers: async () => {
    set({ isFetching: true });
    try {
      const response = await fetch('http://localhost:5000/api/weather/workers');
      if (!response.ok) throw new Error('Failed to fetch workers');
      const data = await response.json();
      
      const workers = data.workers.map(w => ({
        id: `W-${w.id}`,
        name: w.name,
        phone: w.phone,
        lat: parseFloat(w.lat),
        lon: parseFloat(w.lon),
        locationName: w.location_name,
        vehicle: w.vehicle
      }));

      set({ workers, isFetching: false });
    } catch (err) {
      console.error("Worker Simulation: Failed to fetch backend workers.", err);
      set({ isFetching: false });
    }
  }
}));

// Auto-start simulation in demo environment
setTimeout(() => {
  useWorkerStore.getState().startSimulation();
}, 2000);
