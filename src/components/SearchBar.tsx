import React, { useState, useEffect, useRef } from "react";
import { Search, MapPin, Loader2 } from "lucide-react";
import { GeocodingResult } from "../types";
import { fetchCitySuggestions } from "../weatherService";

interface SearchBarProps {
  onSearch: (cityQuery: string) => void;
  onSelectSuggestion: (selection: GeocodingResult) => void;
  onUseMyLocation: () => void;
  isGpsLoading: boolean;
}

export default function SearchBar({
  onSearch,
  onSelectSuggestion,
  onUseMyLocation,
  isGpsLoading,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<GeocodingResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounce suggest fetch
  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsLoadingSuggestions(true);
      const list = await fetchCitySuggestions(query);
      setSuggestions(list);
      setIsLoadingSuggestions(false);
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // Close suggestions card on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setShowDropdown(false);
    }
  };

  const handleSelect = (suggestion: GeocodingResult) => {
    onSelectSuggestion(suggestion);
    setQuery(`${suggestion.name}${suggestion.country ? `, ${suggestion.country}` : ""}`);
    setShowDropdown(false);
  };

  return (
    <div className="relative w-full max-w-xl mx-auto z-50 px-2" id="search-bar-container">
      <form onSubmit={handleSubmit} className="flex gap-2 items-center">
        {/* Input Wrapper with premium search-bar-pill class */}
        <div className="relative flex-1 flex items-center search-bar-pill px-4 py-1.5 gap-2.5 shadow-xl transition-all duration-300 hover:border-white/20 focus-within:border-white/30 focus-within:bg-black/30">
          <Search className="text-slate-400 w-5 h-5 shrink-0 pointer-events-none" />
          
          <input
            type="text"
            id="city-search-input"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            placeholder="Search city..."
            className="w-full bg-transparent text-white placeholder-white/50 text-base outline-none border-none py-2 focus:ring-0 focus:outline-none placeholder:font-normal font-medium"
          />
          
          {isLoadingSuggestions && (
            <Loader2 className="text-slate-400 animate-spin w-5 h-5 shrink-0" />
          )}

          <button
            type="submit"
            id="search-submit-btn"
            className="bg-white/20 hover:bg-white/30 text-white font-semibold rounded-full px-5 py-2.5 cursor-pointer transition-all duration-200 shrink-0 text-xs tracking-wider uppercase"
          >
            SEARCH
          </button>
        </div>

        <button
          type="button"
          id="geolocate-btn"
          onClick={onUseMyLocation}
          disabled={isGpsLoading}
          title="Auto-detect coordinates"
          className="p-3.5 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 active:scale-[0.95] disabled:opacity-50 disabled:pointer-events-none transition-all duration-200 shadow-lg cursor-pointer shrink-0"
        >
          {isGpsLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-sky-400" />
          ) : (
            <MapPin className="w-5 h-5 text-white" />
          )}
        </button>
      </form>

      {/* Autocomplete Suggestions Dropdown Grid */}
      {showDropdown && (suggestions.length > 0 || (query.length >= 2 && !isLoadingSuggestions && suggestions.length === 0)) && (
        <div
          ref={dropdownRef}
          id="suggestions-dropdown"
          className="absolute left-2 right-2 mt-2 bg-slate-950/80 border border-white/15 rounded-2xl shadow-2xl backdrop-blur-2xl overflow-hidden divide-y divide-white/5 z-50 transition-all duration-300"
        >
          {suggestions.length > 0 ? (
            suggestions.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item)}
                className="w-full text-left px-5 py-3.5 hover:bg-white/10 transition-colors flex flex-col gap-0.5 cursor-pointer text-white"
              >
                <span className="font-semibold text-sm line-clamp-1">{item.name}</span>
                <span className="text-xs text-slate-400 line-clamp-1">
                  {[item.admin1, item.country].filter(Boolean).join(", ")}
                </span>
              </button>
            ))
          ) : (
            <div className="px-5 py-4 text-sm text-slate-400 text-center">
              No matching cities found. Try another spelling.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
