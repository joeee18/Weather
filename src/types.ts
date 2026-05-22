export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string; // State / Region
  timezone?: string;
}

export interface CurrentWeather {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  time: string;
}

export interface ForecastDay {
  date: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
}

export interface WeatherData {
  city: string;
  country?: string;
  region?: string;
  latitude: number;
  longitude: number;
  current: CurrentWeather;
  forecast: ForecastDay[];
}

export interface WeatherCodeDetails {
  text: string;
  emoji: string;
  bgGradient: string;
  themeColor: string;
}
