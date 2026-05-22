import { motion } from "motion/react";
import { Thermometer, Droplets, Wind, MapPin, Calendar } from "lucide-react";
import { WeatherData } from "../types";
import { getWeatherDetails } from "../weatherCodes";

interface CurrentWeatherCardProps {
  weather: WeatherData;
}

export default function CurrentWeatherCard({ weather }: CurrentWeatherCardProps) {
  const details = getWeatherDetails(weather.current.weatherCode);

  // Format local current timestamp nicely
  const formatDate = () => {
    try {
      const parsedDate = new Date(weather.current.time);
      return parsedDate.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Today";
    }
  };

  // Get current local time
  const formatTime = () => {
    try {
      const parsedDate = new Date(weather.current.time);
      return parsedDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      id="current-weather-card"
      className="w-full max-w-xl mx-auto frosted-main-container p-6 md:p-10 relative overflow-hidden"
    >
      {/* Decorative ambient background orb that reflects the current weather code theme */}
      <div
        className={`absolute -top-16 -right-16 w-52 h-52 rounded-full blur-3xl opacity-20 bg-current transition-all duration-700 ${details.themeColor}`}
      />

      {/* City header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 relative z-10 pb-6 border-b border-white/10">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white shrink-0 mt-1">
            <MapPin className="w-5 h-5 text-sky-400" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white line-clamp-1">
              {weather.city}
            </h2>
            <p className="text-sm font-medium text-slate-400">
              {[weather.region, weather.country].filter(Boolean).join(", ")}
            </p>
          </div>
        </div>

        <div className="flex flex-row md:flex-col items-center md:items-end gap-2 text-slate-300 md:text-right text-xs bg-white/5 md:bg-transparent px-3 py-1.5 md:p-0 rounded-lg w-fit">
          <Calendar className="w-3.5 h-3.5 md:hidden text-sky-400" />
          <span className="font-semibold">{formatDate()}</span>
          <span className="text-slate-400 hidden md:inline">{formatTime()}</span>
        </div>
      </div>

      {/* Main Temp & Condition */}
      <div className="py-8 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        <div className="flex flex-col text-center md:text-left">
          <div className="flex items-start justify-center md:justify-start">
            <span className="text-8xl md:text-[112px] font-extralight tracking-tighter text-white leading-none">
              {Math.round(weather.current.temperature)}°
            </span>
            <span className="text-2xl font-semibold opacity-70 ml-1 mt-3">C</span>
          </div>
          <span className={`text-xl md:text-2xl font-medium mt-2 flex items-center gap-2 justify-center md:justify-start ${details.themeColor}`}>
            {details.text}
          </span>
        </div>

        {/* Gigantic Weather Emoji Icon */}
        <div className="text-8xl md:text-[120px] pointer-events-none select-none drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] transform hover:scale-110 transition-transform duration-300">
          {details.emoji}
        </div>
      </div>

      {/* Detail Metrics Metrics Grid styled with frosted-sub-metric containers */}
      <div className="grid grid-cols-3 gap-4 relative z-10 pt-6 border-t border-white/10">
        {/* Apparent Temp */}
        <div className="frosted-sub-metric p-4 flex flex-col items-center text-center hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
          <Thermometer className="w-5 h-5 text-amber-400 mb-2" />
          <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-1">Feels Like</span>
          <span className="text-base md:text-lg font-bold text-white font-mono">
            {Math.round(weather.current.feelsLike)}°C
          </span>
        </div>

        {/* Humidity */}
        <div className="frosted-sub-metric p-4 flex flex-col items-center text-center hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
          <Droplets className="w-5 h-5 text-sky-400 mb-2" />
          <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-1">Humidity</span>
          <span className="text-base md:text-lg font-bold text-white font-mono">
            {weather.current.humidity}%
          </span>
        </div>

        {/* Wind Speed */}
        <div className="frosted-sub-metric p-4 flex flex-col items-center text-center hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
          <Wind className="w-5 h-5 text-emerald-400 mb-2" />
          <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-1">Wind</span>
          <span className="text-base md:text-lg font-bold text-white font-mono">
            {weather.current.windSpeed} <span className="text-[10px] text-slate-400">km/h</span>
          </span>
        </div>
      </div>
    </motion.div>
  );
}
