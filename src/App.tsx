import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CloudSun, HelpCircle, Loader2, Navigation, RefreshCw, ThermometerSun, AlertCircle } from "lucide-react";
import { WeatherData, GeocodingResult } from "./types";
import {
  searchCity,
  fetchWeatherForLocation,
  getNameFromCoords,
  trackSearchEvent,
  DEFAULT_CITY,
} from "./weatherService";
import { getWeatherDetails } from "./weatherCodes";
import SearchBar from "./components/SearchBar";
import CurrentWeatherCard from "./components/CurrentWeatherCard";
import ForecastList from "./components/ForecastList";

export default function App() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isGpsLoading, setIsGpsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Popular quick-select cities for outstanding user discovery and speed
  const popularCities = [
    { name: "Tokyo", lat: 35.6762, lon: 139.6503, country: "Japan" },
    { name: "New York", lat: 40.7128, lon: -74.006, country: "United States" },
    { name: "Paris", lat: 48.8566, lon: 2.3522, country: "France" },
    { name: "Sydney", lat: -33.8688, lon: 151.2093, country: "Australia" },
    { name: "Cairo", lat: 30.0444, lon: 31.2357, country: "Egypt" },
  ];

  // Load weather for a specific latitude and longitude coordinate
  const loadWeather = async (
    lat: number,
    lon: number,
    cityName: string,
    country?: string,
    region?: string
  ) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const data = await fetchWeatherForLocation(lat, lon, cityName, country, region);
      setWeather(data);
    } catch (e: any) {
      setErrorMsg("Failed to update weather data. Please inspect network link.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  // Load by raw search input
  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const result = await searchCity(query);
      if (result) {
        // Track the GA4 search event safely
        trackSearchEvent(result.name);
        
        await loadWeather(
          result.latitude,
          result.longitude,
          result.name,
          result.country,
          result.admin1
        );
      } else {
        setErrorMsg(`City "${query}" not found. Try checks on spelling.`);
        setIsLoading(false);
      }
    } catch {
      setErrorMsg("Error querying city details. Please retry.");
      setIsLoading(false);
    }
  };

  // Load by precise selection from the Search suggestions autocomplete dropdown
  const handleSelectSuggestion = async (selection: GeocodingResult) => {
    // Track search event on selection
    trackSearchEvent(selection.name);
    
    await loadWeather(
      selection.latitude,
      selection.longitude,
      selection.name,
      selection.country,
      selection.admin1
    );
  };

  // Detect and fetch user location weather via the Geolocation API
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      showTemporaryToast("Geolocation is not supported by your browser");
      // Fallback silently
      loadDefaultWeather();
      return;
    }

    setIsGpsLoading(true);
    setErrorMsg(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // Reverse geocode to get city display label
          const locationInfo = await getNameFromCoords(latitude, longitude);
          await loadWeather(
            latitude,
            longitude,
            locationInfo.name,
            locationInfo.country,
            locationInfo.admin1
          );
          showTemporaryToast(`Located: ${locationInfo.name}`);
        } catch (e) {
          console.error(e);
          // Fallback if parsing details failed
          await loadWeather(position.coords.latitude, position.coords.longitude, "Your Location");
        } finally {
          setIsGpsLoading(false);
        }
      },
      (error) => {
        setIsGpsLoading(false);
        let message = "Location access denied.";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = "Location access denied. Please grant permission or use search.";
            break;
          case error.POSITION_UNAVAILABLE:
            message = "Location position information unavailable. falling back.";
            break;
          case error.TIMEOUT:
            message = "Location request timed out.";
            break;
        }
        showTemporaryToast(message);
        // If weather is empty, load the default city so the UI is never blank
        if (!weather) {
          loadDefaultWeather();
        }
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  };

  const loadDefaultWeather = () => {
    loadWeather(
      DEFAULT_CITY.latitude,
      DEFAULT_CITY.longitude,
      DEFAULT_CITY.name,
      DEFAULT_CITY.country,
      DEFAULT_CITY.admin1
    );
  };

  const showTemporaryToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((prev) => (prev === msg ? null : prev));
    }, 4500);
  };

  // Auto-detect coordinate position on page load
  useEffect(() => {
    handleUseMyLocation();
  }, []);

  // Determine current weather design parameters
  const activeDetails = weather
    ? getWeatherDetails(weather.current.weatherCode)
    : {
        text: "Connecting",
        emoji: "🌤️",
        bgGradient: "from-slate-900 via-indigo-950 to-neutral-950 border-white/10",
        themeColor: "text-sky-400",
      };

  return (
    <div
      className={`min-h-screen w-full relative overflow-y-auto px-4 py-8 md:py-12 flex flex-col justify-between transition-colors duration-1000 bg-gradient-to-br ${activeDetails.bgGradient} font-sans text-white`}
      id="main-app-container"
    >
      {/* Absolute ambient lights mapping the Design HTML spec */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,223,0,0.15)_0%,transparent_40%),radial-gradient(circle_at_20%_80%,rgba(0,191,255,0.15)_0%,transparent_50%)] pointer-events-none z-1" />

      {/* Dynamic ambient star/light glow effect */}
      <div className="absolute inset-0 bg-radial-[circle_at_center,_var(--tw-gradient-stops)] from-transparent via-slate-950/20 to-slate-950/80 pointer-events-none mix-blend-overlay z-1" />

      {/* Main interactive window */}
      <div className="w-full max-w-4xl mx-auto z-10 flex-1 flex flex-col items-center">
        {/* Glowing header banner */}
        <header className="mb-8 text-center select-none" id="app-header">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex items-center justify-center gap-2 mb-2"
          >
            <div className="bg-white/10 p-1.5 rounded-xl border border-white/20 hover:rotate-12 transition-transform duration-300">
              <CloudSun className="w-7 h-7 text-sky-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-sky-300 bg-clip-text text-transparent">
              SKYLINE WEATHER
            </h1>
          </motion.div>
          <p className="text-sm font-semibold tracking-wider text-slate-400 uppercase">
            Hyperlocal WMO meteorological model
          </p>
        </header>

        {/* Search bar with action nodes */}
        <SearchBar
          onSearch={handleSearch}
          onSelectSuggestion={handleSelectSuggestion}
          onUseMyLocation={handleUseMyLocation}
          isGpsLoading={isGpsLoading}
        />

        {/* Quick select tags */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4.5 mb-8 z-20" id="quick-links-group">
          <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 mr-1 select-none">
            Popular:
          </span>
          {popularCities.map((c) => (
            <button
              key={c.name}
              type="button"
              id={`quick-link-${c.name.toLowerCase()}`}
              onClick={() => {
                // Trigger GA4 search event for standard cities as well to feed metrics accurately
                trackSearchEvent(c.name);
                loadWeather(c.lat, c.lon, c.name, c.country);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/15 hover:bg-white/10 text-xs font-semibold text-slate-200 hover:text-white hover:scale-105 active:scale-95 transition-all duration-200 shadow-sm cursor-pointer"
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Error notification banner */}
        <AnimatePresence>
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              id="error-msg-banner"
              className="w-full max-w-xl bg-rose-950/40 border border-rose-500/30 text-rose-200 px-5 py-3.5 rounded-2xl mb-8 flex items-center gap-3 backdrop-blur-xl shrink-0"
            >
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <div className="flex-1 flex justify-between items-center gap-2">
                <span className="text-xs md:text-sm font-medium">{errorMsg}</span>
                <button
                  onClick={() => setErrorMsg(null)}
                  className="text-xs font-bold text-rose-400 hover:text-white hover:underline uppercase shrink-0 px-2 cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main core representation section */}
        <main className="w-full pb-10" id="main-weather-section">
          <AnimatePresence mode="wait">
            {isLoading ? (
              // Glassmorphism Skeleton loader to deliver extremely high-end polished loading UX
              <motion.div
                key="loading-skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full text-center py-20 flex flex-col items-center justify-center gap-4"
              >
                <div className="relative">
                  <Loader2 className="w-12 h-12 text-sky-400 animate-spin" />
                  <ThermometerSun className="w-5 h-5 text-amber-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-200">Querying Open-Meteo satellite arrays...</p>
                  <p className="text-xs text-slate-400 mt-1">Retrieving micro-climate forecast data</p>
                </div>
              </motion.div>
            ) : weather ? (
              <motion.div
                key="weather-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                {/* 1. Current Weather representation */}
                <CurrentWeatherCard weather={weather} />

                {/* 2. 5-Day forecast grid */}
                <ForecastList forecast={weather.forecast} />

                {/* Manual Refresh Indicator */}
                <div className="flex justify-center mt-8">
                  <button
                    onClick={() =>
                      loadWeather(
                        weather.latitude,
                        weather.longitude,
                        weather.city,
                        weather.country,
                        weather.region
                      )
                    }
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold text-slate-300 hover:text-white cursor-pointer active:scale-95 transition-all"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Refresh metrics
                  </button>
                </div>
              </motion.div>
            ) : (
              // Empty / Fallback helper
              <motion.div
                key="empty-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16 bg-white/5 rounded-3xl border border-white/5 backdrop-blur-md max-w-xl mx-auto px-6"
              >
                <HelpCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-white mb-1">No forecast selected</h3>
                <p className="text-sm text-slate-400 mb-6">
                  Provide a city search or enable geo location to query live temperatures.
                </p>
                <button
                  onClick={handleUseMyLocation}
                  className="px-6 py-2.5 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-bold text-sm transition-all"
                >
                  Use Default Current Location
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Dynamic Temporary Toasts Notification overlay */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            id="toast-notification"
            className="fixed bottom-6 left-1/2 -translate-x-1/2 py-2.5 px-5 bg-slate-900/90 border border-white/10 rounded-full shadow-2xl backdrop-blur-2xl text-xs md:text-sm text-white font-medium flex items-center gap-2 z-50 whitespace-nowrap"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Styled persistent Footer */}
      <footer className="w-full text-center py-4 border-t border-white/5 mt-10 text-[11px] font-semibold text-slate-500 tracking-wide select-none">
        Powered by Open-Meteo Meteorological Database • No API Key required
      </footer>
    </div>
  );
}
