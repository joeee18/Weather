import { WeatherCodeDetails } from "./types";

/**
 * Maps standard WMO (World Meteorological Organization) weather codes to representation styles.
 */
export const weatherCodeMap: Record<number, WeatherCodeDetails> = {
  0: {
    text: "Clear Sky",
    emoji: "☀️",
    bgGradient: "from-amber-500/10 via-blue-600/30 to-indigo-950/90 border-amber-500/30",
    themeColor: "text-amber-400",
  },
  1: {
    text: "Mainly Clear",
    emoji: "🌤️",
    bgGradient: "from-sky-500/10 via-sky-700/30 to-slate-900/95 border-sky-400/20",
    themeColor: "text-sky-300",
  },
  2: {
    text: "Partly Cloudy",
    emoji: "⛅",
    bgGradient: "from-blue-600/10 via-slate-600/30 to-zinc-900/95 border-blue-400/20",
    themeColor: "text-sky-200",
  },
  3: {
    text: "Overcast",
    emoji: "☁️",
    bgGradient: "from-slate-600/15 via-slate-800/40 to-slate-950 border-slate-700/40",
    themeColor: "text-slate-300",
  },
  45: {
    text: "Foggy",
    emoji: "🌫️",
    bgGradient: "from-zinc-600/10 via-slate-800/40 to-neutral-950 border-zinc-650/30",
    themeColor: "text-zinc-300",
  },
  48: {
    text: "Depositing Rime Fog",
    emoji: "🌫️",
    bgGradient: "from-teal-800/10 via-slate-800/30 to-zinc-950 border-teal-600/20",
    themeColor: "text-teal-300",
  },
  51: {
    text: "Light Drizzle",
    emoji: "🌧️",
    bgGradient: "from-blue-800/10 via-indigo-900/30 to-neutral-950 border-indigo-500/20",
    themeColor: "text-blue-300",
  },
  53: {
    text: "Moderate Drizzle",
    emoji: "🌧️",
    bgGradient: "from-blue-900/15 via-indigo-900/30 to-slate-950 border-indigo-500/30",
    themeColor: "text-indigo-300",
  },
  55: {
    text: "Dense Drizzle",
    emoji: "🌧️",
    bgGradient: "from-blue-950/25 via-indigo-950/40 to-neutral-950 border-indigo-400/30",
    themeColor: "text-indigo-400",
  },
  56: {
    text: "Light Freezing Drizzle",
    emoji: "🌨️",
    bgGradient: "from-cyan-900/15 via-emerald-950/20 to-slate-950 border-cyan-400/20",
    themeColor: "text-cyan-300",
  },
  57: {
    text: "Dense Freezing Drizzle",
    emoji: "🌨️",
    bgGradient: "from-cyan-950/25 via-sky-950/40 to-zinc-950 border-cyan-400/30",
    themeColor: "text-cyan-400",
  },
  61: {
    text: "Slight Rain",
    emoji: "🌧️",
    bgGradient: "from-sky-800/15 via-blue-950/45 to-neutral-950 border-sky-500/20",
    themeColor: "text-sky-300",
  },
  63: {
    text: "Moderate Rain",
    emoji: "🌧️",
    bgGradient: "from-blue-900/20 via-sky-950/50 to-neutral-950 border-blue-500/30",
    themeColor: "text-blue-400",
  },
  65: {
    text: "Heavy Rain",
    emoji: "🌧️",
    bgGradient: "from-blue-950/35 via-slate-900/60 to-black border-blue-400/40",
    themeColor: "text-blue-500",
  },
  66: {
    text: "Light Freezing Rain",
    emoji: "🌨️",
    bgGradient: "from-teal-800/20 via-blue-950/40 to-slate-950 border-teal-500/30",
    themeColor: "text-teal-300",
  },
  67: {
    text: "Heavy Freezing Rain",
    emoji: "🌨️",
    bgGradient: "from-teal-900/30 via-sky-950/50 to-neutral-950 border-teal-400/40",
    themeColor: "text-teal-400",
  },
  71: {
    text: "Slight Snowfall",
    emoji: "❄️",
    bgGradient: "from-sky-100/10 via-blue-900/30 to-zinc-950 border-sky-200/20",
    themeColor: "text-sky-100",
  },
  73: {
    text: "Moderate Snowfall",
    emoji: "❄️",
    bgGradient: "from-sky-200/10 via-sky-900/30 to-slate-950 border-sky-300/30",
    themeColor: "text-sky-200",
  },
  75: {
    text: "Heavy Snowfall",
    emoji: "❄️",
    bgGradient: "from-slate-100/15 via-indigo-950/40 to-slate-950 border-white/20",
    themeColor: "text-white",
  },
  77: {
    text: "Snow Grains",
    emoji: "❄️",
    bgGradient: "from-slate-200/10 via-slate-900/35 to-zinc-950 border-slate-300/20",
    themeColor: "text-slate-200",
  },
  80: {
    text: "Slight Rain Showers",
    emoji: "🌧️",
    bgGradient: "from-indigo-600/15 via-blue-950/40 to-neutral-950 border-indigo-400/20",
    themeColor: "text-indigo-300",
  },
  81: {
    text: "Moderate Rain Showers",
    emoji: "🌧️",
    bgGradient: "from-indigo-800/20 via-emerald-950/30 to-slate-950 border-indigo-400/30",
    themeColor: "text-indigo-400",
  },
  82: {
    text: "Violent Rain Showers",
    emoji: "⛈️",
    bgGradient: "from-rose-950/20 via-slate-900/50 to-neutral-950 border-rose-500/35",
    themeColor: "text-rose-400",
  },
  85: {
    text: "Slight Snow Showers",
    emoji: "🌨️",
    bgGradient: "from-sky-300/10 via-indigo-950/35 to-zinc-950 border-sky-300/20",
    themeColor: "text-sky-200",
  },
  86: {
    text: "Heavy Snow Showers",
    emoji: "🌨️",
    bgGradient: "from-slate-300/15 via-zinc-900/40 to-slate-950 border-slate-300/30",
    themeColor: "text-slate-100",
  },
  95: {
    text: "Thunderstorm",
    emoji: "⛈️",
    bgGradient: "from-violet-950/30 via-slate-900/50 to-neutral-950 border-violet-500/30",
    themeColor: "text-purple-300",
  },
  96: {
    text: "Thunderstorm with Hail",
    emoji: "⛈️",
    bgGradient: "from-fuchsia-950/30 via-slate-900/55 to-stone-950 border-fuchsia-500/30",
    themeColor: "text-fuchsia-300",
  },
  99: {
    text: "Severe Thunderstorm",
    emoji: "⛈️",
    bgGradient: "from-red-950/25 via-slate-900/60 to-zinc-950 border-red-500/30",
    themeColor: "text-rose-400",
  },
};

export function getWeatherDetails(code: number): WeatherCodeDetails {
  if (code in weatherCodeMap) {
    return weatherCodeMap[code];
  }
  // Safe default
  return {
    text: "Unknown Weather Condition",
    emoji: "🌡️",
    bgGradient: "from-blue-900/10 via-slate-800/30 to-neutral-950 border-slate-700/20",
    themeColor: "text-slate-300",
  };
}
