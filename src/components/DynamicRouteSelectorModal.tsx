import { useState } from 'react';
import { 
  Plane, 
  ArrowRight, 
  X, 
  Check, 
  MapPin, 
  RotateCw, 
  Compass,
  Sparkles,
  Search
} from 'lucide-react';
import { HubCode } from '../types';
import { 
  AIRPORT_REGISTRY, 
  BOARDING_POINTS, 
  DESTINATION_AIRPORTS, 
  PRESET_CORRIDORS, 
  AirportInfo 
} from '../data/airportsData';
import { airlineSound } from '../utils/airlineSoundEngine';

interface DynamicRouteSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentOrigin: string;
  currentHub: HubCode;
  currentDestination: string;
  onSelectRoute: (origin: string, hub: HubCode, destination: string) => void;
}

export function DynamicRouteSelectorModal({
  isOpen,
  onClose,
  currentOrigin,
  currentHub,
  currentDestination,
  onSelectRoute,
}: DynamicRouteSelectorModalProps) {
  const [selectedOrigin, setSelectedOrigin] = useState<string>(currentOrigin);
  const [selectedHub, setSelectedHub] = useState<HubCode>(currentHub);
  const [selectedDestination, setSelectedDestination] = useState<string>(currentDestination);
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const originAirport = AIRPORT_REGISTRY[selectedOrigin] || AIRPORT_REGISTRY.LHR;
  const hubAirport = AIRPORT_REGISTRY[selectedHub] || AIRPORT_REGISTRY.SIN;
  const destAirport = AIRPORT_REGISTRY[selectedDestination] || AIRPORT_REGISTRY.SYD;

  const handleApply = () => {
    airlineSound.playAirportChime();
    airlineSound.playFlybyWhoosh();
    onSelectRoute(selectedOrigin, selectedHub, selectedDestination);
    onClose();
  };

  const handleApplyPreset = (origin: string, hub: HubCode, dest: string) => {
    setSelectedOrigin(origin);
    setSelectedHub(hub);
    setSelectedDestination(dest);
    airlineSound.playAirportChime();
    airlineSound.playFlybyWhoosh();
    onSelectRoute(origin, hub, dest);
    onClose();
  };

  const handleSwapAirports = () => {
    // Only swap if origin is in destination list and dest is in boarding points
    const temp = selectedOrigin;
    setSelectedOrigin(selectedDestination);
    setSelectedDestination(temp);
    airlineSound.playRadarPing();
  };

  return (
    <div 
      id="route-selector-modal-backdrop"
      className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        id="route-selector-modal-card"
        className="bg-[#FAF8F3] border border-[#DDD6C8] rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#DDD6C8] bg-white flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1E2022] text-white flex items-center justify-center shrink-0 shadow-sm">
              <Plane className="w-5 h-5 text-[#FB923C] -rotate-45" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-display font-bold text-[#1E2022]">
                  Dynamic Airport & Route Selector
                </h2>
                <span className="text-[10px] font-mono font-bold bg-[#C2410C]/10 text-[#C2410C] px-2 py-0.5 rounded border border-[#C2410C]/20">
                  Global Flight Network
                </span>
              </div>
              <p className="text-xs text-[#5A606A] mt-0.5">
                Customize your boarding point, intermediate hub, and destination flight.
              </p>
            </div>
          </div>

          <button
            id="close-route-selector-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#FAF8F3] hover:bg-[#EFEBE1] border border-[#DDD6C8] flex items-center justify-center text-[#5A606A] hover:text-[#1E2022] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Dynamic Route Preview Ribbon */}
        <div className="p-3 sm:p-4 bg-[#F5F1E8] border-b border-[#DDD6C8] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {/* Origin */}
            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-[#DDD6C8] shadow-2xs">
              <span className="text-lg">{originAirport.flag}</span>
              <div>
                <div className="text-[9px] font-mono uppercase text-[#8C929A] font-bold">Boarding Point</div>
                <div className="text-xs font-mono font-bold text-[#1E2022]">{originAirport.city} ({originAirport.code})</div>
              </div>
            </div>

            <ArrowRight className="w-4 h-4 text-[#C2410C]" />

            {/* Hub */}
            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-[#C2410C]/40 shadow-2xs">
              <span className="text-lg">{hubAirport.flag}</span>
              <div>
                <div className="text-[9px] font-mono uppercase text-[#C2410C] font-bold">Transit Hub</div>
                <div className="text-xs font-mono font-bold text-[#1E2022]">{hubAirport.city} ({hubAirport.code})</div>
              </div>
            </div>

            <ArrowRight className="w-4 h-4 text-[#C2410C]" />

            {/* Destination */}
            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-[#DDD6C8] shadow-2xs">
              <span className="text-lg">{destAirport.flag}</span>
              <div>
                <div className="text-[9px] font-mono uppercase text-[#8C929A] font-bold">Destination Flight</div>
                <div className="text-xs font-mono font-bold text-[#1E2022]">{destAirport.city} ({destAirport.code})</div>
              </div>
            </div>
          </div>

          <button
            onClick={handleSwapAirports}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-[#DDD6C8] text-xs font-mono text-[#5A606A] hover:text-[#C2410C] hover:border-[#C2410C] transition-all shadow-2xs active:scale-95"
            title="Swap Origin and Destination"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Swap Points</span>
          </button>
        </div>

        {/* Scrollable Selection Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
          {/* Quick Preset Corridors */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold uppercase text-[#1E2022] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#C2410C]" />
                Popular Global Flight Corridors
              </span>
              <span className="text-[10px] font-mono text-[#737A84]">One-Click Preset</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PRESET_CORRIDORS.map((corridor) => {
                const isActive = 
                  corridor.origin === selectedOrigin && 
                  corridor.hub === selectedHub && 
                  corridor.destination === selectedDestination;

                return (
                  <button
                    key={corridor.id}
                    onClick={() => handleApplyPreset(corridor.origin, corridor.hub, corridor.destination)}
                    className={`p-2.5 rounded-xl border text-left transition-all flex items-start justify-between gap-2 ${
                      isActive 
                        ? 'bg-[#FAF2EC] border-[#C2410C] ring-1 ring-[#C2410C]/30 shadow-2xs' 
                        : 'bg-white border-[#E0D9CB] hover:border-[#C2410C]/60 hover:bg-[#FAF8F3]'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-[#1E2022] flex items-center gap-1.5">
                        <span>{corridor.origin}</span>
                        <span className="text-[#C2410C]">➔</span>
                        <span>{corridor.hub}</span>
                        <span className="text-[#C2410C]">➔</span>
                        <span>{corridor.destination}</span>
                        <span className="text-[10px] text-[#737A84] font-normal">({corridor.recommendedAirline})</span>
                      </div>
                      <div className="text-[10px] font-mono text-[#737A84] mt-0.5">{corridor.tagline}</div>
                    </div>
                    {isActive && <Check className="w-4 h-4 text-[#C2410C] shrink-0 mt-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 1. Select Boarding Point (Origin) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono font-bold uppercase text-[#1E2022] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                1. Select Boarding Point (Departure Airport)
              </label>
              <span className="text-[10px] font-mono text-[#737A84]">
                Current: {originAirport.city} ({originAirport.code})
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {BOARDING_POINTS.map((apt) => {
                const isSelected = apt.code === selectedOrigin;
                return (
                  <button
                    key={apt.code}
                    onClick={() => {
                      setSelectedOrigin(apt.code);
                      airlineSound.playRadarPing();
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500/30 font-bold'
                        : 'bg-white border-[#DDD6C8] hover:border-blue-400 hover:bg-[#FAF8F3]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-base">{apt.flag}</span>
                      <span className="text-xs font-mono font-bold text-[#1E2022]">{apt.code}</span>
                    </div>
                    <div className="text-xs font-semibold text-[#1E2022] mt-1 truncate">{apt.city}</div>
                    <div className="text-[9px] font-mono text-[#737A84] truncate">{apt.timezone}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Select Intermediate Transit Corridor (Hub) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono font-bold uppercase text-[#1E2022] flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#C2410C]" />
                2. Select Transit Hub Corridor
              </label>
              <span className="text-[10px] font-mono text-[#C2410C] font-bold">
                Active: {hubAirport.city} ({hubAirport.code})
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                { hub: 'SIN' as HubCode, airline: 'Singapore Airlines', aircraft: 'Airbus A380 / A350', perk: 'Changi Airport T3 • +325m Curfew Buffer' },
                { hub: 'DXB' as HubCode, airline: 'Emirates', aircraft: 'Airbus A380-800 Flagship', perk: 'Dubai Intl T3 • Onboard Lounge & Shower' },
                { hub: 'DOH' as HubCode, airline: 'Qatar Airways', aircraft: 'Airbus A350-1000 Qsuite', perk: 'Hamad Intl • 94.2% OTP Record' },
              ].map((h) => {
                const isSelected = h.hub === selectedHub;
                const apt = AIRPORT_REGISTRY[h.hub];
                return (
                  <button
                    key={h.hub}
                    onClick={() => {
                      setSelectedHub(h.hub);
                      airlineSound.playFlybyWhoosh();
                    }}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-[#FAF2EC] border-[#C2410C] ring-2 ring-[#C2410C]/30 shadow-2xs'
                        : 'bg-white border-[#DDD6C8] hover:border-[#C2410C] hover:bg-[#FAF8F3]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-lg">{apt.flag}</span>
                        <span className="font-display font-bold text-sm text-[#1E2022]">{h.hub}</span>
                      </div>
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${isSelected ? 'bg-[#C2410C] text-white' : 'bg-[#EFEBE1] text-[#737A84]'}`}>
                        {apt.city}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-[#1E2022] mt-1.5">{h.airline}</div>
                    <div className="text-[10px] font-mono text-[#5A606A]">{h.aircraft}</div>
                    <div className="text-[9px] font-mono text-[#C2410C] mt-1">{h.perk}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Select Destination Airport */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono font-bold uppercase text-[#1E2022] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                3. Select Destination Flight (Arrival Airport)
              </label>
              <span className="text-[10px] font-mono text-[#737A84]">
                Current: {destAirport.city} ({destAirport.code})
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {DESTINATION_AIRPORTS.map((apt) => {
                const isSelected = apt.code === selectedDestination;
                return (
                  <button
                    key={apt.code}
                    onClick={() => {
                      setSelectedDestination(apt.code);
                      airlineSound.playRadarPing();
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500/30 font-bold'
                        : 'bg-white border-[#DDD6C8] hover:border-emerald-400 hover:bg-[#FAF8F3]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-base">{apt.flag}</span>
                      <span className="text-xs font-mono font-bold text-[#1E2022]">{apt.code}</span>
                    </div>
                    <div className="text-xs font-semibold text-[#1E2022] mt-1 truncate">{apt.city}</div>
                    <div className="text-[9px] font-mono text-[#737A84] truncate">{apt.timezone}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3.5 sm:p-4 bg-white border-t border-[#DDD6C8] flex items-center justify-between gap-3">
          <div className="text-[11px] font-mono text-[#737A84] hidden sm:block">
            Route: <strong className="text-[#1E2022]">{originAirport.code} ➔ {hubAirport.code} ➔ {destAirport.code}</strong>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl bg-white border border-[#DDD6C8] text-xs font-mono text-[#5A606A] hover:text-[#1E2022]"
            >
              Cancel
            </button>
            <button
              id="confirm-route-change-btn"
              onClick={handleApply}
              className="px-5 py-2 rounded-xl bg-[#C2410C] hover:bg-[#A33408] text-white text-xs font-mono font-bold shadow-sm transition-all flex items-center gap-1.5"
            >
              <span>Apply Dynamic Flight Route</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
