import { create } from 'zustand';
import { useNotificationStore } from './notificationStore';

const MOCK_WORKERS = [
  { id: 'W-101', name: 'Raj Kumar', phone: '9876543210', lat: 28.6139, lon: 77.2090, locationName: 'Delhi', vehicle: 'Motorcycle' },
  { id: 'W-102', name: 'Ramesh Singh', phone: '9876543211', lat: 19.0760, lon: 72.8777, locationName: 'Mumbai', vehicle: 'Scooter' },
  { id: 'W-103', name: 'Suresh Iyer', phone: '9876543212', lat: 13.0827, lon: 80.2707, locationName: 'Chennai', vehicle: 'Motorcycle' },
  { id: 'W-104', name: 'Amit Das', phone: '9876543213', lat: 22.5726, lon: 88.3639, locationName: 'Kolkata', vehicle: 'Bicycle' },
  { id: 'W-105', name: 'Karthik Gowda', phone: '9876543214', lat: 12.9716, lon: 77.5946, locationName: 'Bangalore', vehicle: 'Motorcycle' },
  { id: 'W-106', name: 'Mohammed Ali', phone: '9876543215', lat: 17.3850, lon: 78.4867, locationName: 'Hyderabad', vehicle: 'Scooter' },
  { id: 'W-107', name: 'Vikram Patel', phone: '9876543216', lat: 23.0225, lon: 72.5714, locationName: 'Ahmedabad', vehicle: 'Motorcycle' },
  { id: 'W-108', name: 'Manoj Tiwari', phone: '9876543217', lat: 26.8467, lon: 80.9462, locationName: 'Lucknow', vehicle: 'Bicycle' },
  { id: 'W-109', name: 'Ravi Verma', phone: '9876543218', lat: 21.1458, lon: 79.0882, locationName: 'Nagpur', vehicle: 'Motorcycle' },
  { id: 'W-110', name: 'Sanjay Gupta', phone: '9876543219', lat: 26.1420, lon: 91.7314, locationName: 'Guwahati', vehicle: 'Motorcycle' },
];

export const useWorkerStore = create((set, get) => ({
  workers: MOCK_WORKERS,
  isSimulating: false,
  
  startSimulation: () => {
    if (get().isSimulating) return;
    set({ isSimulating: true });
    
    // Initial fetch
    get().pollWeather();
    
    // Simulate real-time GPS checking every 1 minute
    const intervalId = setInterval(() => {
      get().pollWeather();
    }, 60 * 1000);
    
    window.__workerSimulationInterval = intervalId;
  },

  pollWeather: async () => {
    const workers = get().workers;
    const { addNotification } = useNotificationStore.getState();
    const updatedWorkers = [...workers];
    
    try {
      // open-meteo actually errors frequently if taking massive bulk arrays. Let's do a fast Promise.all for 10 users to be safe.
      const promises = updatedWorkers.map(w => 
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${w.lat}&longitude=${w.lon}&current_weather=true`)
          .then(res => res.json())
      );
      
      const results = await Promise.all(promises);
      
      for (let i = 0; i < updatedWorkers.length; i++) {
         const data = results[i];
         const workerWeather = data?.current_weather;
         if (!workerWeather) continue;
         
         updatedWorkers[i].currentWeather = workerWeather;
         
         // Trigger Logic (Alert if severe Heat OR severe Rain/Storm)
         const isHot = workerWeather.temperature >= 35;
         const isStormy = workerWeather.weathercode >= 61;
         
         if (isHot || isStormy) {
           const riskType = isHot ? 'Severe Heat' : 'Heavy Rainfall & Hazards';
           const surgeAmount = isHot ? '₹80' : '₹150';
           
           addNotification({
              workerId: updatedWorkers[i].id,
              workerName: updatedWorkers[i].name,
              location: updatedWorkers[i].locationName,
              riskType: riskType,
              temperature: workerWeather.temperature,
              weathercode: workerWeather.weathercode,
              message: `Weather Surge Active! Hello ${updatedWorkers[i].name}, ${riskType.toLowerCase()} detected at your current GPS location (${updatedWorkers[i].locationName}). Your surge trigger amount of +${surgeAmount} is now active for upcoming assignments.`
           });
         }
      }
      
      set({ workers: updatedWorkers });
    } catch (err) {
       console.error("Worker Simulation: Failed to process GPS weather poll.", err);
    }
  }
}));

// Auto-start simulation in demo environment
setTimeout(() => {
  useWorkerStore.getState().startSimulation();
}, 2000);
