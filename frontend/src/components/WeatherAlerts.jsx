import React, { useState, useEffect } from 'react';
import { AlertOctagon, MapPin, Droplets, Flame, CloudLightning } from 'lucide-react';

const INDIA_LOCATIONS = [
  { name: 'Delhi NCR', lat: 28.6139, lon: 77.2090 },
  { name: 'Mumbai', lat: 19.0760, lon: 72.8777 },
  { name: 'Chennai', lat: 13.0827, lon: 80.2707 },
  { name: 'Kolkata', lat: 22.5726, lon: 88.3639 },
  { name: 'Bangalore', lat: 12.9716, lon: 77.5946 },
  { name: 'Hyderabad', lat: 17.3850, lon: 78.4867 },
  { name: 'Ahmedabad', lat: 23.0225, lon: 72.5714 }
];

const WeatherAlerts = () => {
  const [highRiskAreas, setHighRiskAreas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllWeather = async () => {
      try {
        const promises = INDIA_LOCATIONS.map(async (loc) => {
          const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lon}&current_weather=true`);
          if (!res.ok) return null;
          const data = await res.json();
          return { ...loc, weather: data.current_weather };
        });

        const results = await Promise.all(promises);
        
        // Filter out nulls and define 'high risk'
        // High risk: Temp >= 35°C (Heatwave) OR WeatherCode >= 61 (Heavy Rain/Thunderstorm/Snow)
        const risks = results.filter(r => {
          if (!r || !r.weather) return false;
          const isHot = r.weather.temperature >= 35;
          const isStormy = r.weather.weathercode >= 61;
          const isExtreme = r.weather.temperature <= 5; // Unlikely in these cities, but possible
          
          if (isHot) r.riskType = 'Severe Heat';
          else if (isStormy) r.riskType = 'Severe Weather / Rain';
          else if (isExtreme) r.riskType = 'Extreme Cold';
          
          return isHot || isStormy || isExtreme;
        });

        setHighRiskAreas(risks);
      } catch (error) {
        console.error("Failed to fetch regional weather:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllWeather();
    
    // Refresh every 15 minutes
    const interval = setInterval(fetchAllWeather, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading || highRiskAreas.length === 0) return null;

  return (
    <div className="w-full bg-rose-500/10 dark:bg-rose-900/20 border-b border-rose-200 dark:border-rose-800 backdrop-blur-md overflow-hidden relative group">
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-rose-50 dark:from-slate-900 to-transparent z-10"></div>
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-rose-50 dark:from-slate-900 to-transparent z-10"></div>
      
      <div className="flex items-center whitespace-nowrap animate-[marquee_25s_linear_infinite] hover:[animation-play-state:paused] py-2.5">
        <div className="flex items-center gap-6 px-4">
          <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-bold text-sm bg-rose-100 dark:bg-rose-900/50 px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-700">
            <AlertOctagon size={14} className="animate-pulse" />
            WORKER ALERT
          </span>
          
          {highRiskAreas.map((area, idx) => (
            <div key={idx} className="flex items-center gap-2 text-slate-800 dark:text-slate-200 text-sm font-medium">
              <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                <MapPin size={14} />
                {area.name}:
              </span>
              <span className="text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1">
                {area.riskType === 'Severe Heat' && <Flame size={14} />}
                {area.riskType === 'Severe Weather / Rain' && <Droplets size={14} />}
                {area.riskType === 'Extreme Cold' && <CloudLightning size={14} />}
                {area.weather.temperature}°C ({area.riskType})
              </span>
              <span className="text-indigo-600 dark:text-cyan-400 font-bold text-[11px] uppercase tracking-wider ml-1 bg-indigo-50 dark:bg-slate-800 px-2 py-0.5 rounded border border-indigo-100 dark:border-slate-700">
                Surge Active
              </span>
              {idx < highRiskAreas.length - 1 && <span className="mx-3 text-slate-300 dark:text-slate-600">|</span>}
            </div>
          ))}
          
           {/* Duplicate for seamless scrolling */}
           <span className="mx-3 text-slate-300 dark:text-slate-600">|</span>
           <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-bold text-sm bg-rose-100 dark:bg-rose-900/50 px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-700">
            <AlertOctagon size={14} className="animate-pulse" />
            WORKER ALERT
          </span>
          
          {highRiskAreas.map((area, idx) => (
            <div key={`dup-${idx}`} className="flex items-center gap-2 text-slate-800 dark:text-slate-200 text-sm font-medium">
              <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                <MapPin size={14} />
                {area.name}:
              </span>
              <span className="text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1">
                {area.riskType === 'Severe Heat' && <Flame size={14} />}
                {area.riskType === 'Severe Weather / Rain' && <Droplets size={14} />}
                {area.riskType === 'Extreme Cold' && <CloudLightning size={14} />}
                {area.weather.temperature}°C ({area.riskType})
              </span>
              <span className="text-indigo-600 dark:text-cyan-400 font-bold text-[11px] uppercase tracking-wider ml-1 bg-indigo-50 dark:bg-slate-800 px-2 py-0.5 rounded border border-indigo-100 dark:border-slate-700">
                Surge Active
              </span>
              {idx < highRiskAreas.length - 1 && <span className="mx-3 text-slate-300 dark:text-slate-600">|</span>}
            </div>
          ))}

        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}} />
    </div>
  );
};

export default WeatherAlerts;
