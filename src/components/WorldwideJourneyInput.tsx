import React, { useState, useRef, useEffect } from 'react';
import { 
  WorldwideLocation, 
  EXAMPLE_WORLDWIDE_JOURNEYS, 
  searchWorldwideLocations, 
  resolveLocationFromInput,
  WORLDWIDE_LOCATIONS,
  calculateDistanceNm
} from '../data/worldwideLocations';
import { 
  Plane, 
  ArrowLeftRight, 
  MapPin, 
  Search, 
  Train, 
  Ship, 
  Compass, 
  X, 
  Check, 
  Sparkles, 
  Globe, 
  Navigation,
  Info,
  Layers
} from 'lucide-react';

interface WorldwideJourneyInputProps {
  origin: WorldwideLocation;
  destination: WorldwideLocation;
  onChangeOrigin: (loc: WorldwideLocation) => void;
  onChangeDestination: (loc: WorldwideLocation) => void;
  variant?: 'full' | 'compact' | 'modal';
  onCloseModal?: () => void;
}

export function WorldwideJourneyInput({
  origin,
  destination,
  onChangeOrigin,
  onChangeDestination,
  variant = 'full',
  onCloseModal,
}: WorldwideJourneyInputProps) {
  // Free text input values
  const [originInput, setOriginInput] = useState(
    origin.code ? `${origin.city}, ${origin.country} (${origin.code})` : origin.name
  );
  const [destInput, setDestInput] = useState(
    destination.code ? `${destination.city}, ${destination.country} (${destination.code})` : destination.name
  );

  // Sync with prop changes if modified externally
  useEffect(() => {
    setOriginInput(origin.code ? `${origin.city}, ${origin.country} (${origin.code})` : origin.name);
  }, [origin]);

  useEffect(() => {
    setDestInput(destination.code ? `${destination.city}, ${destination.country} (${destination.code})` : destination.name);
  }, [destination]);

  // Dropdown states
  const [isOriginFocused, setIsOriginFocused] = useState(false);
  const [isDestFocused, setIsDestFocused] = useState(false);
  const [originSuggestions, setOriginSuggestions] = useState<WorldwideLocation[]>([]);
  const [destSuggestions, setDestSuggestions] = useState<WorldwideLocation[]>([]);
  
  // Selected region filter for suggestion explorer
  const [activeRegionFilter, setActiveRegionFilter] = useState<string>('All');

  const originRef = useRef<HTMLDivElement>(null);
  const destRef = useRef<HTMLDivElement>(null);

  // Handle outside click to close dropdowns
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (originRef.current && !originRef.current.contains(e.target as Node)) {
        setIsOriginFocused(false);
      }
      if (destRef.current && !destRef.current.contains(e.target as Node)) {
        setIsDestFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update suggestions dynamically as user types
  useEffect(() => {
    const results = searchWorldwideLocations(originInput, 15);
    setOriginSuggestions(
      activeRegionFilter === 'All' 
        ? results 
        : results.filter(r => r.region === activeRegionFilter)
    );
  }, [originInput, activeRegionFilter]);

  useEffect(() => {
    const results = searchWorldwideLocations(destInput, 15);
    setDestSuggestions(
      activeRegionFilter === 'All' 
        ? results 
        : results.filter(r => r.region === activeRegionFilter)
    );
  }, [destInput, activeRegionFilter]);

  // Apply location select
  const handleSelectOrigin = (loc: WorldwideLocation) => {
    onChangeOrigin(loc);
    setOriginInput(loc.code ? `${loc.city}, ${loc.country} (${loc.code})` : loc.name);
    setIsOriginFocused(false);
  };

  const handleSelectDestination = (loc: WorldwideLocation) => {
    onChangeDestination(loc);
    setDestInput(loc.code ? `${loc.city}, ${loc.country} (${loc.code})` : loc.name);
    setIsDestFocused(false);
  };

  // Submit manual typing (free text, custom worldwide location)
  const handleManualOriginSubmit = () => {
    if (!originInput.trim()) return;
    const resolved = resolveLocationFromInput(originInput);
    onChangeOrigin(resolved);
    setIsOriginFocused(false);
  };

  const handleManualDestSubmit = () => {
    if (!destInput.trim()) return;
    const resolved = resolveLocationFromInput(destInput);
    onChangeDestination(resolved);
    setIsDestFocused(false);
  };

  // Swap boarding point and destination
  const handleSwap = () => {
    const prevOrigin = origin;
    const prevDest = destination;
    onChangeOrigin(prevDest);
    onChangeDestination(prevOrigin);
    setOriginInput(prevDest.code ? `${prevDest.city}, ${prevDest.country} (${prevDest.code})` : prevDest.name);
    setDestInput(prevOrigin.code ? `${prevOrigin.city}, ${prevOrigin.country} (${prevOrigin.code})` : prevOrigin.name);
  };

  // Apply one of the 12 example journeys
  const handleApplyPreset = (preset: typeof EXAMPLE_WORLDWIDE_JOURNEYS[0]) => {
    const origLoc = resolveLocationFromInput(preset.originText);
    const destLoc = resolveLocationFromInput(preset.destinationText);
    onChangeOrigin(origLoc);
    onChangeDestination(destLoc);
    setOriginInput(origLoc.code ? `${origLoc.city}, ${origLoc.country} (${origLoc.code})` : origLoc.name);
    setDestInput(destLoc.code ? `${destLoc.city}, ${destLoc.country} (${destLoc.code})` : destLoc.name);
  };

  // Helper icon for location type
  const getLocationIcon = (type: WorldwideLocation['type']) => {
    switch (type) {
      case 'rail':
        return <Train className="w-3.5 h-3.5 text-blue-600 shrink-0" />;
      case 'port':
      case 'ferry':
        return <Ship className="w-3.5 h-3.5 text-teal-600 shrink-0" />;
      case 'city':
      case 'country':
        return <Globe className="w-3.5 h-3.5 text-purple-600 shrink-0" />;
      case 'custom':
        return <Navigation className="w-3.5 h-3.5 text-amber-600 shrink-0" />;
      default:
        return <Plane className="w-3.5 h-3.5 text-[#C2410C] shrink-0" />;
    }
  };

  const distanceNm = calculateDistanceNm(origin.coordinates, destination.coordinates);
  const distanceKm = Math.round(distanceNm * 1.852);

  const regions = ['All', 'Asia', 'Europe', 'North America', 'South America', 'Africa', 'Oceania'];

  return (
    <div id="worldwide-journey-builder" className="bg-white border border-[#DDD6C8] rounded-xl p-4 sm:p-5 shadow-sm space-y-4">
      {/* Top Banner Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#F0EBE1] pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#C2410C]/10 text-[#C2410C] flex items-center justify-center font-bold">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-bold text-sm text-[#1E2022]">
                Worldwide Journey Coverage & Location Dispatcher
              </h3>
              <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-300">
                Global Coverage Active
              </span>
            </div>
            <p className="text-[11px] text-[#5A606A] mt-0.5">
              Enter any country, city, airport, rail station, ferry terminal, or custom worldwide point. Not limited to fixed routes.
            </p>
          </div>
        </div>

        {onCloseModal && (
          <button 
            onClick={onCloseModal}
            className="p-1 rounded-md text-[#8C929A] hover:text-[#1E2022] hover:bg-[#FAF8F3]"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Region Filter Explorer Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
        <span className="text-[10px] font-mono font-bold text-[#8C929A] uppercase shrink-0 mr-1 flex items-center gap-1">
          <Layers className="w-3 h-3" />
          Regions:
        </span>
        {regions.map((reg) => (
          <button
            key={reg}
            type="button"
            onClick={() => setActiveRegionFilter(reg)}
            className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-all shrink-0 ${
              activeRegionFilter === reg
                ? 'bg-[#1E2022] text-white font-bold shadow-2xs'
                : 'bg-[#FAF8F3] text-[#5A606A] hover:text-[#1E2022] hover:bg-[#EFEBE1] border border-[#E0D9CB]'
            }`}
          >
            {reg}
          </button>
        ))}
      </div>

      {/* Inputs Grid: Boarding Point [From] ⇄ [Swap] ⇄ Destination [To] */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Origin / Boarding Point (Col 1 to 5) */}
        <div ref={originRef} className="md:col-span-5 relative">
          <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#5A606A] mb-1 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#C2410C]" />
              Boarding Point / From:
            </span>
            <span className="text-[10px] text-[#8C929A] font-normal">
              {origin.region} &bull; {origin.type}
            </span>
          </label>

          <div className="relative">
            <input
              id="worldwide-origin-input"
              type="text"
              value={originInput}
              onChange={(e) => setOriginInput(e.target.value)}
              onFocus={() => setIsOriginFocused(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleManualOriginSubmit();
                }
              }}
              placeholder="Type any country, city, airport, station or port..."
              className="w-full bg-[#FAF8F3] hover:bg-white focus:bg-white border border-[#DDD6C8] focus:border-[#C2410C] focus:ring-1 focus:ring-[#C2410C] rounded-lg px-3 py-2 text-xs text-[#1E2022] font-mono outline-none transition-all pr-16"
            />

            <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {originInput && (
                <button
                  type="button"
                  onClick={() => {
                    setOriginInput('');
                    setIsOriginFocused(true);
                  }}
                  className="p-1 text-[#8C929A] hover:text-[#1E2022]"
                  title="Clear boarding point"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
              <span className="text-sm">{origin.flag || '📍'}</span>
            </div>
          </div>

          {/* Origin Autocomplete Suggestions Dropdown */}
          {isOriginFocused && (
            <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-white border border-[#DDD6C8] rounded-xl shadow-xl max-h-72 overflow-y-auto p-1.5 space-y-1 animate-fade-in">
              <div className="px-2 py-1 text-[10px] font-mono font-bold text-[#8C929A] uppercase tracking-wider border-b border-[#F0EBE1] flex items-center justify-between">
                <span>Worldwide Suggestions ({originSuggestions.length})</span>
                <span className="text-[9px] text-[#C2410C]">Press Enter for free text</span>
              </div>

              {/* Free Text Direct Option */}
              {originInput.trim() && (
                <button
                  type="button"
                  onClick={handleManualOriginSubmit}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left text-xs bg-amber-50/70 hover:bg-amber-100 text-amber-900 font-mono transition-colors border border-amber-200"
                >
                  <Navigation className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <div className="truncate">
                    <span className="font-bold">Use exact custom location: </span>
                    <span className="underline">&ldquo;{originInput}&rdquo;</span>
                  </div>
                </button>
              )}

              {/* Matched Worldwide Locations */}
              {originSuggestions.map((loc) => (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => handleSelectOrigin(loc)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left text-xs transition-colors ${
                    origin.id === loc.id
                      ? 'bg-[#FAF0E6] text-[#C2410C] font-bold'
                      : 'hover:bg-[#FAF8F3] text-[#1E2022]'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-sm shrink-0">{loc.flag}</span>
                    {getLocationIcon(loc.type)}
                    <div className="truncate">
                      <div className="font-medium text-[12px] truncate">
                        {loc.name}
                      </div>
                      <div className="text-[10px] text-[#8C929A] font-mono">
                        {loc.city}, {loc.country} {loc.code ? `• ${loc.code}` : ''} ({loc.region})
                      </div>
                    </div>
                  </div>
                  {origin.id === loc.id && <Check className="w-3.5 h-3.5 text-[#C2410C] shrink-0" />}
                </button>
              ))}

              {originSuggestions.length === 0 && (
                <div className="p-3 text-center text-xs text-[#8C929A]">
                  <p>No catalog match. Press Enter to use &ldquo;{originInput}&rdquo; as a custom worldwide location.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Swap Button (Col 6) */}
        <div className="md:col-span-2 flex flex-col items-center justify-center pt-2 md:pt-4">
          <button
            type="button"
            id="swap-journey-locations-btn"
            onClick={handleSwap}
            title="Swap Origin & Destination"
            className="p-2.5 rounded-full bg-[#FAF8F3] hover:bg-white border border-[#DDD6C8] hover:border-[#C2410C] text-[#5A606A] hover:text-[#C2410C] shadow-2xs hover:shadow-md transition-all active:scale-95 group"
          >
            <ArrowLeftRight className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
          </button>
          <span className="text-[9px] font-mono text-[#8C929A] mt-1 hidden md:block">
            {distanceNm} NM ({distanceKm} km)
          </span>
        </div>

        {/* Destination / Arrival Point (Col 7 to 11) */}
        <div ref={destRef} className="md:col-span-5 relative">
          <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#5A606A] mb-1 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#C2410C]" />
              Destination / To:
            </span>
            <span className="text-[10px] text-[#8C929A] font-normal">
              {destination.region} &bull; {destination.type}
            </span>
          </label>

          <div className="relative">
            <input
              id="worldwide-dest-input"
              type="text"
              value={destInput}
              onChange={(e) => setDestInput(e.target.value)}
              onFocus={() => setIsDestFocused(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleManualDestSubmit();
                }
              }}
              placeholder="Type any country, city, airport, station or port..."
              className="w-full bg-[#FAF8F3] hover:bg-white focus:bg-white border border-[#DDD6C8] focus:border-[#C2410C] focus:ring-1 focus:ring-[#C2410C] rounded-lg px-3 py-2 text-xs text-[#1E2022] font-mono outline-none transition-all pr-16"
            />

            <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {destInput && (
                <button
                  type="button"
                  onClick={() => {
                    setDestInput('');
                    setIsDestFocused(true);
                  }}
                  className="p-1 text-[#8C929A] hover:text-[#1E2022]"
                  title="Clear destination"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
              <span className="text-sm">{destination.flag || '📍'}</span>
            </div>
          </div>

          {/* Destination Autocomplete Suggestions Dropdown */}
          {isDestFocused && (
            <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-white border border-[#DDD6C8] rounded-xl shadow-xl max-h-72 overflow-y-auto p-1.5 space-y-1 animate-fade-in">
              <div className="px-2 py-1 text-[10px] font-mono font-bold text-[#8C929A] uppercase tracking-wider border-b border-[#F0EBE1] flex items-center justify-between">
                <span>Worldwide Suggestions ({destSuggestions.length})</span>
                <span className="text-[9px] text-[#C2410C]">Press Enter for free text</span>
              </div>

              {/* Free Text Direct Option */}
              {destInput.trim() && (
                <button
                  type="button"
                  onClick={handleManualDestSubmit}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left text-xs bg-amber-50/70 hover:bg-amber-100 text-amber-900 font-mono transition-colors border border-amber-200"
                >
                  <Navigation className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <div className="truncate">
                    <span className="font-bold">Use exact custom location: </span>
                    <span className="underline">&ldquo;{destInput}&rdquo;</span>
                  </div>
                </button>
              )}

              {/* Matched Worldwide Locations */}
              {destSuggestions.map((loc) => (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => handleSelectDestination(loc)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left text-xs transition-colors ${
                    destination.id === loc.id
                      ? 'bg-[#FAF0E6] text-[#C2410C] font-bold'
                      : 'hover:bg-[#FAF8F3] text-[#1E2022]'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-sm shrink-0">{loc.flag}</span>
                    {getLocationIcon(loc.type)}
                    <div className="truncate">
                      <div className="font-medium text-[12px] truncate">
                        {loc.name}
                      </div>
                      <div className="text-[10px] text-[#8C929A] font-mono">
                        {loc.city}, {loc.country} {loc.code ? `• ${loc.code}` : ''} ({loc.region})
                      </div>
                    </div>
                  </div>
                  {destination.id === loc.id && <Check className="w-3.5 h-3.5 text-[#C2410C] shrink-0" />}
                </button>
              ))}

              {destSuggestions.length === 0 && (
                <div className="p-3 text-center text-xs text-[#8C929A]">
                  <p>No catalog match. Press Enter to use &ldquo;{destInput}&rdquo; as a custom worldwide location.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Preserved Route Status Strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-[#FAF8F3] px-3.5 py-2 rounded-lg border border-[#DDD6C8] text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
          <span className="text-[#8C929A]">Active Preserved Journey:</span>
          <strong className="text-[#1E2022]">
            {origin.name} {origin.code ? `(${origin.code})` : ''}
          </strong>
          <span className="text-[#C2410C] font-bold">&rarr;</span>
          <strong className="text-[#1E2022]">
            {destination.name} {destination.code ? `(${destination.code})` : ''}
          </strong>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-[#5A606A]">
          <span>Great Circle: <strong>{distanceNm} NM</strong> ({distanceKm} km)</span>
          <span>&bull;</span>
          <span className="text-emerald-700 font-semibold">100% Preserved in Analysis</span>
        </div>
      </div>

      {/* 12 Presets / Highlighted Examples from user prompt */}
      <div className="space-y-2 pt-1 border-t border-[#F0EBE1]">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8C929A] flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-amber-500" />
            Featured Worldwide Journey Examples (Click to apply & replace):
          </span>
          <span className="text-[10px] font-mono text-[#8C929A]">
            12 Global Routes Across 6 Continents
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5">
          {EXAMPLE_WORLDWIDE_JOURNEYS.map((preset) => {
            const isMatch = 
              (origin.name.includes(preset.title.split('→')[0].trim()) || origin.city.includes(preset.title.split('→')[0].trim().split(',')[0])) &&
              (destination.name.includes(preset.title.split('→')[1].trim()) || destination.city.includes(preset.title.split('→')[1].trim().split(',')[0]));
            
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className={`p-2 rounded-lg text-left text-[11px] font-mono border transition-all ${
                  isMatch
                    ? 'bg-[#FAF0E6] border-[#C2410C] text-[#C2410C] shadow-2xs font-bold'
                    : 'bg-[#FAF8F3] hover:bg-white border-[#E0D9CB] hover:border-[#C2410C]/60 text-[#1E2022]'
                }`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-bold truncate">{preset.title}</span>
                  {isMatch && <Check className="w-3 h-3 text-[#C2410C] shrink-0" />}
                </div>
                <div className="text-[9px] text-[#8C929A] truncate">
                  {preset.regionPair}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
