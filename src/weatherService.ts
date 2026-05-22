import { WeatherData, GeocodingResult, ForecastDay, CurrentWeather } from "./types";

// Fallback search term if Geolocation or user search fails
export const DEFAULT_CITY = {
  name: "London",
  latitude: 51.5085,
  longitude: -0.1257,
  country: "United Kingdom",
  admin1: "England",
};

/**
 * Perform a keyword city search via Open-Meteo Geocoding API
 */
export async function searchCity(query: string): Promise<GeocodingResult | null> {
  if (!query.trim()) return null;
  
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=10`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Geocoding service error");
    
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      // Return the first match or let the user choose (we can map the list if we want an advanced autocomplete picker!)
      return data.results[0];
    }
  } catch (error) {
    console.error("Geocoding search failed:", error);
  }
  return null;
}

/**
 * Fetch list of matches for autocomplete
 */
export async function fetchCitySuggestions(query: string): Promise<GeocodingResult[]> {
  if (!query.trim() || query.length < 2) return [];
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5`;
    const response = await fetch(url);
    if (!response.ok) return [];
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Suggestions fetch error:", error);
    return [];
  }
}

/**
 * Perform reverse geocoding to get a city name from coordinates
 * We will use open-meteo's parameters or a free geocoding fallback if possible. Or we can use coordinates as a display name in the interim.
 * To do this elegantly, we can check if there's any reverse geocoding, or query a free API, or request the closest administrative city.
 * Alternatively, we can use a free reverse nominatim/open-meteo API or fallback gracefully displaying "My Location".
 */
export async function getNameFromCoords(lat: number, lon: number): Promise<{ name: string; country?: string; admin1?: string }> {
  try {
    // Big cities coordinates lookup or simple coordinate text, or a lightweight reverse lookup.
    // Let's do a fast free reverse geocoding via OSM Nominatim or similar, which is highly reliable.
    // To prevent throttling or blocking, we also have coordinate feedback.
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=en`;
    const response = await fetch(url, { headers: { "User-Agent": "WeatherAppletJoe" } });
    if (response.ok) {
      const data = await response.json();
      const city = data.address?.city || data.address?.town || data.address?.village || data.address?.suburb || "Detected Location";
      return {
        name: city,
        country: data.address?.country,
        admin1: data.address?.state || data.address?.county,
      };
    }
  } catch (e) {
    console.warn("Reverse geocoding query failed, fallback to coordinates label", e);
  }
  return { name: "Current Location", country: `${lat.toFixed(2)}°, ${lon.toFixed(2)}°` };
}

/**
 * Fetch full current and daily forecast data from Open-Meteo Weather API
 */
export async function fetchWeatherForLocation(
  lat: number,
  lon: number,
  cityName: string,
  country?: string,
  region?: string
): Promise<WeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,apparent_temperature&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Unable to retrieve weather forecast model");
  }
  
  const data = await response.json();
  
  const currentRaw = data.current;
  const current: CurrentWeather = {
    temperature: currentRaw.temperature_2m,
    feelsLike: currentRaw.apparent_temperature,
    humidity: currentRaw.relative_humidity_2m,
    windSpeed: currentRaw.wind_speed_10m,
    weatherCode: currentRaw.weather_code,
    time: currentRaw.time,
  };
  
  const dailyRaw = data.daily;
  const forecast: ForecastDay[] = [];
  
  // Format daily forecasts for next 5 days (Open-Meteo returns 7 days by default, we slice to first 5 days)
  if (dailyRaw && dailyRaw.time) {
    const totalDays = Math.min(5, dailyRaw.time.length);
    for (let i = 0; i < totalDays; i++) {
      forecast.push({
        date: dailyRaw.time[i],
        weatherCode: dailyRaw.weather_code[i],
        tempMax: dailyRaw.temperature_2m_max[i],
        tempMin: dailyRaw.temperature_2m_min[i],
      });
    }
  }
  
  return {
    city: cityName,
    country,
    region,
    latitude: lat,
    longitude: lon,
    current,
    forecast,
  };
}

/**
 * Fire safe analytics search event tracking
 */
export function trackSearchEvent(cityName: string) {
  if (typeof window !== "undefined" && (window as any).gtag) {
    try {
      (window as any).gtag("event", "search", {
        search_term: cityName,
      });
      console.log(`[GA4] Tracked search event for: ${cityName}`);
    } catch (err) {
      console.warn("Google Analytics tracking event errored", err);
    }
  }
}
