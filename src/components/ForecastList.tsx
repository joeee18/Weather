import { motion } from "motion/react";
import { CalendarDays } from "lucide-react";
import { ForecastDay } from "../types";
import { getWeatherDetails } from "../weatherCodes";

interface ForecastListProps {
  forecast: ForecastDay[];
}

export default function ForecastList({ forecast }: ForecastListProps) {
  // Format standard date to day of the week (e.g. "Mon" or "Today")
  const formatDayName = (dateStr: string, index: number) => {
    if (index === 0) return "Today";
    try {
      const date = new Date(dateStr);
      // In case native parsing timezone causes offset shift, we can format correctly:
      return date.toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" });
    } catch {
      return dateStr;
    }
  };

  const formatMonthDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
    } catch {
      return "";
    }
  };

  return (
    <div id="forecast-section" className="w-full max-w-4xl mx-auto mt-10 px-2 relative z-20">
      <div className="flex items-center gap-2 mb-4">
        <CalendarDays className="w-5 h-5 text-sky-400" />
        <h3 className="text-lg font-bold tracking-tight text-white uppercase text-xs">
          5-Day Forecast
        </h3>
      </div>

      {/* Grid wrapper: fluid responsive style */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        {forecast.map((day, idx) => {
          const details = getWeatherDetails(day.weatherCode);
          // Highlight Tomorrow (index 1) just like the design template did for "WED"
          const isHighlighted = idx === 1;
          const cardClass = isHighlighted ? "frosted-forecast-card-highlight" : "frosted-forecast-card";
          
          return (
            <motion.div
              key={day.date}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.4 }}
              className={`${cardClass} p-5 flex flex-col items-center justify-between text-center transition-all duration-300 hover:scale-[1.04] cursor-default shadow-lg`}
            >
              {/* Day identity */}
              <div className="mb-2">
                <span className="text-sm font-bold text-white block uppercase tracking-wider">
                  {formatDayName(day.date, idx)}
                </span>
                <span className="text-[10px] font-semibold text-slate-300 block tracking-tight mt-0.5">
                  {formatMonthDate(day.date)}
                </span>
              </div>

              {/* Weather Condition Icon */}
              <span
                className="text-4xl my-3 select-none pointer-events-none drop-shadow-md hover:scale-110 transition-transform cursor-default"
                title={details.text}
              >
                {details.emoji}
              </span>

              {/* High & Low Temps */}
              <div className="flex flex-col gap-0.5 mt-2 w-full">
                {/* Condition label snippet */}
                <span className="text-[10px] tracking-wide font-medium text-slate-200 line-clamp-1 truncate px-1 pb-1">
                  {details.text}
                </span>
                <div className="flex items-center justify-center gap-2.5 pt-1.5 border-t border-white/10 w-full">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-slate-400 uppercase font-semibold">Max</span>
                    <span className="text-sm font-bold text-sky-300 font-mono">
                      {Math.round(day.tempMax)}°
                    </span>
                  </div>
                  <div className="w-[1px] h-6 bg-white/10 shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-[9px] text-slate-400 uppercase font-semibold">Min</span>
                    <span className="text-sm font-bold text-slate-300 font-mono">
                      {Math.round(day.tempMin)}°
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
