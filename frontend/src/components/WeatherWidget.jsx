import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Wind, Loader, CloudLightning, CloudSnow } from 'lucide-react';

const WeatherWidget = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Default coordinates in case geolocation fails or is denied.
    const fetchWeather = async (lat = 28.6139, lon = 77.2090) => {
      try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
        const data = await res.json();
        setWeather(data.current_weather);
      } catch (error) {
        console.error("Failed to fetch weather", error);
      } finally {
        setLoading(false);
      }
    };

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.warn("Geolocation denied or failed. Using default location.");
          fetchWeather();
        }
      );
    } else {
      fetchWeather();
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center px-4 py-2 rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-white/60 dark:border-white/10 text-slate-500 animate-pulse">
        <Loader size={18} className="animate-spin mr-2"/> 
        <span className="text-sm font-semibold">Loading Weather...</span>
      </div>
    );
  }

  if (!weather) return null;

  const getWeatherIcon = (code) => {
    // WMO Weather interpretation codes
    if (code === 0) return <Sun size={20} className="text-amber-500 drop-shadow-sm" />;
    if (code > 0 && code <= 3) return <Cloud size={20} className="text-slate-400 drop-shadow-sm" />;
    if (code >= 51 && code <= 67) return <CloudRain size={20} className="text-blue-400 drop-shadow-sm" />;
    if (code >= 71 && code <= 77) return <CloudSnow size={20} className="text-cyan-300 drop-shadow-sm" />;
    if (code >= 95) return <CloudLightning size={20} className="text-indigo-400 drop-shadow-sm" />;
    return <Wind size={20} className="text-slate-500 drop-shadow-sm" />;
  };

  return (
    <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-gradient-to-r from-white/60 to-white/30 dark:from-slate-800/60 dark:to-slate-800/30 backdrop-blur-md border border-white/60 dark:border-white/10 shadow-[0_4px_15px_rgba(0,0,0,0.05)] transition-all hover:scale-105 hover:shadow-[0_8px_25px_rgba(0,0,0,0.1)] cursor-help" title="Location-based Weather conditions for risk assessment & premium calculation">
      <div className="flex items-center justify-center p-1.5 rounded-full bg-white/50 dark:bg-slate-700/50 shadow-inner">
        {getWeatherIcon(weather.weathercode)}
      </div>
      <div className="flex flex-col">
        <span className="font-extrabold text-sm text-slate-800 dark:text-white leading-tight">
          {weather.temperature}°C
        </span>
        <span className="text-[10px] font-bold text-indigo-500 dark:text-cyan-400 uppercase tracking-widest leading-none mt-0.5">
          Live Risk Factor
        </span>
      </div>
    </div>
  );
};

export default WeatherWidget;
