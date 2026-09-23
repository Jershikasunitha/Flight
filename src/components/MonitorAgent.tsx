import { 
  Activity, 
  Wind, 
  CloudRain, 
  Compass, 
  Gauge, 
  AlertTriangle, 
  CheckCircle2, 
  RotateCw, 
  ShieldAlert, 
  Zap, 
  CloudLightning,
  Clock,
  Radio
} from 'lucide-react';
import { 
  HubCode, 
  DisruptionEvent, 
  AirportWeather, 
  TelemetryData 
} from '../types';
import { DISRUPTION_PRESETS } from '../data/mockFlightData';
import { useLanguage } from '../context/LanguageContext';

interface MonitorAgentProps {
  activeHub: HubCode;
  disruption: DisruptionEvent | null;
  onForceDisruption: (event: DisruptionEvent | null) => void;
  onRunMonitoringCycle: () => void;
  isScanning: boolean;
  cycleCount: number;
  lastScannedAt: string;
  telemetry: TelemetryData;
  weather: {
    origin: AirportWeather;
    hub: AirportWeather;
    destination: AirportWeather;
  };
  connectionBufferMinutes: number;
}

export function MonitorAgent({
  activeHub,
  disruption,
  onForceDisruption,
  onRunMonitoringCycle,
  isScanning,
  cycleCount,
  lastScannedAt,
  telemetry,
  weather,
  connectionBufferMinutes,
}: MonitorAgentProps) {
  const { t, isRTL } = useLanguage();
  const isBufferCritical = connectionBufferMinutes < 45;
  const isBufferTight = connectionBufferMinutes >= 45 && connectionBufferMinutes < 75;

  return (
    <div id="monitor-agent-view" className="space-y-6">
      {/* Agent Header */}
      <div className="bg-[#FAF8F5] border border-[#E6E1D8] rounded-xl p-5 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C2410C] animate-pulse"></span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#C2410C]">
                {t.agent2Title}
              </span>
            </div>
            <h2 className="text-xl font-display font-bold text-[#1E2022] mt-1">
              {t.telemetryRadar}
            </h2>
            <p className="text-xs text-[#5A606A] mt-0.5">
              {t.agent2Desc}
            </p>
          </div>

          {/* Run Cycle Button */}
          <button
            id="run-monitor-cycle-main"
            onClick={onRunMonitoringCycle}
            disabled={isScanning}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#C2410C] hover:bg-[#A33408] text-white text-xs font-mono font-bold transition-all shadow-sm active:scale-95 disabled:opacity-75"
          >
            <RotateCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? t.scanning : t.runCycle}</span>
            <span className="bg-black/25 px-1.5 py-0.5 rounded text-[10px]">#{cycleCount}</span>
          </button>
        </div>
      </div>

      {/* Force Disruption Control Panel */}
      <div className="bg-white border border-[#E6E1D8] rounded-xl p-5 shadow-2xs">
        <div className="flex items-center justify-between border-b border-[#EFECE6] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#C2410C]" />
            <h3 className="font-display font-bold text-sm text-[#1E2022]">
              Autonomous Stress-Test: Force Disruption Scenarios
            </h3>
          </div>
          <span className="text-[11px] font-mono text-[#8C929A]">
            Inject operational anomalies to test real-time agent handoff
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {DISRUPTION_PRESETS.map((preset) => {
            const isActive = disruption?.id === preset.id;
            return (
              <button
                key={preset.id}
                id={`btn-disrupt-${preset.id}`}
                onClick={() => onForceDisruption(isActive ? null : preset)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  isActive
                    ? 'bg-[#FEF2F2] border-[#DC2626] ring-2 ring-[#DC2626]/20'
                    : 'bg-[#FAF8F5] border-[#E6E1D8] hover:border-[#DC2626]/40 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className={`px-1.5 py-0.5 rounded font-bold text-[10px] ${
                    preset.severity === 'CRITICAL' 
                      ? 'bg-red-100 text-red-700' 
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    +{preset.delayMinutes}m DELAY
                  </span>
                  <span className="text-[#8C929A] text-[10px]">{preset.impactedHub} Hub</span>
                </div>
                <div className="font-display font-bold text-xs text-[#1E2022] mt-2 line-clamp-1">
                  {preset.title}
                </div>
                <div className="text-[11px] text-[#5A606A] mt-1 line-clamp-2">
                  {preset.description}
                </div>
                <div className="mt-2.5 pt-2 border-t border-[#EFECE6] flex items-center justify-between text-[10px] font-mono">
                  <span className={isActive ? 'text-[#DC2626] font-bold' : 'text-[#8C929A]'}>
                    {isActive ? '● INJECTED (ACTIVE)' : 'Click to Force'}
                  </span>
                </div>
              </button>
            );
          })}

          {/* Reset / Nominal Button */}
          <button
            id="btn-disrupt-clear"
            onClick={() => onForceDisruption(null)}
            className={`p-3 rounded-lg border text-left transition-all flex flex-col justify-between ${
              !disruption
                ? 'bg-[#F0FDF4] border-emerald-500 ring-2 ring-emerald-500/20'
                : 'bg-[#FAF8F5] border-[#E6E1D8] hover:border-emerald-500/40 hover:bg-white'
            }`}
          >
            <div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="px-1.5 py-0.5 rounded font-bold text-[10px] bg-emerald-100 text-emerald-800">
                  NOMINAL (0m)
                </span>
                <span className="text-emerald-700 text-[10px]">All Corridors</span>
              </div>
              <div className="font-display font-bold text-xs text-[#1E2022] mt-2">
                Nominal Scheduled Ops
              </div>
              <div className="text-[11px] text-[#5A606A] mt-1">
                Zero ATC holds, calm jetstream, clear runways across all hubs.
              </div>
            </div>
            <div className="mt-2.5 pt-2 border-t border-[#EFECE6] flex items-center justify-between text-[10px] font-mono">
              <span className={!disruption ? 'text-emerald-700 font-bold' : 'text-[#8C929A]'}>
                {!disruption ? '● NOMINAL ACTIVE' : 'Clear All Faults'}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Flight Radar Telemetry Strip */}
      <div className="bg-[#181A1C] text-white rounded-xl p-5 border border-[#2B3036] shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#2B3036] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-[#FB923C] animate-pulse" />
            <span className="font-display font-bold text-sm tracking-wide">
              Live ADS-B Telemetry • Flight {telemetry.flightNumber} ({telemetry.aircraft})
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono text-[#8C929A]">
            <span>Waypoint: <strong className="text-white">{telemetry.currentWaypoint}</strong></span>
            <span>Scan Cycle: <strong className="text-[#FB923C]">#{cycleCount}</strong></span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-center">
          <div className="bg-[#22252A] p-3 rounded-lg border border-[#31363D]">
            <span className="text-[10px] text-[#8C929A] block uppercase">Altitude</span>
            <span className="text-lg font-bold text-white tracking-wider">
              {telemetry.altitudeFt.toLocaleString()} FT
            </span>
            <span className="text-[10px] text-[#38BDF8] block mt-0.5">FL370 Inbound</span>
          </div>

          <div className="bg-[#22252A] p-3 rounded-lg border border-[#31363D]">
            <span className="text-[10px] text-[#8C929A] block uppercase">Ground Speed</span>
            <span className="text-lg font-bold text-white tracking-wider">
              {telemetry.groundSpeedKts} KTS
            </span>
            <span className="text-[10px] text-emerald-400 block mt-0.5">Mach 0.85 Cruise</span>
          </div>

          <div className="bg-[#22252A] p-3 rounded-lg border border-[#31363D]">
            <span className="text-[10px] text-[#8C929A] block uppercase">Heading / Track</span>
            <span className="text-lg font-bold text-white tracking-wider">
              {telemetry.headingDeg}° SE
            </span>
            <span className="text-[10px] text-[#A78BFA] block mt-0.5">Great Circle Track</span>
          </div>

          <div className={`p-3 rounded-lg border ${
            isBufferCritical
              ? 'bg-red-950/60 border-red-500'
              : isBufferTight
                ? 'bg-amber-950/60 border-amber-500'
                : 'bg-[#22252A] border-[#31363D]'
          }`}>
            <span className="text-[10px] text-[#8C929A] block uppercase">Connection Buffer</span>
            <span className={`text-lg font-bold tracking-wider ${
              isBufferCritical ? 'text-red-400' : isBufferTight ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {connectionBufferMinutes} MIN
            </span>
            <span className="text-[10px] text-[#8C929A] block mt-0.5">
              {isBufferCritical ? 'CRITICAL DEFICIT' : isBufferTight ? 'TIGHT MARGIN' : 'SAFE (+45m MCT)'}
            </span>
          </div>
        </div>
      </div>

      {/* Corridor Weather Cards (Origin, Hub, Destination) */}
      <div>
        <div className="text-xs font-mono uppercase tracking-wider text-[#737A84] font-semibold mb-3 flex items-center justify-between">
          <span>Corridor METAR & Terminal Aerodrome Weather</span>
          <span className="text-xs font-mono text-[#8C929A]">Updated {lastScannedAt}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Origin LHR */}
          <div className="bg-white border border-[#E6E1D8] rounded-xl p-4 shadow-2xs">
            <div className="flex items-center justify-between border-b border-[#EFECE6] pb-2 mb-3">
              <div className="font-display font-bold text-sm text-[#1E2022]">
                LHR • London Heathrow
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#EFECE6] text-[#5A606A]">
                ORIGIN
              </span>
            </div>
            <div className="flex items-center justify-between my-2 text-xs">
              <span className="text-2xl font-bold font-display text-[#1E2022]">{weather.origin.temperatureC}°C</span>
              <span className="text-[#5A606A] text-right text-xs">{weather.origin.condition}</span>
            </div>
            <div className="space-y-1 text-xs text-[#5A606A] font-mono">
              <div className="flex justify-between">
                <span>Wind:</span> <strong>{weather.origin.wind}</strong>
              </div>
              <div className="flex justify-between">
                <span>Visibility:</span> <strong>{weather.origin.visibilityKm} km</strong>
              </div>
            </div>
            <div className="mt-3 p-2 bg-[#F4F1EA] rounded font-mono text-[10px] text-[#6A717B] break-all">
              {weather.origin.metar}
            </div>
          </div>

          {/* Active Hub (SIN, DXB, DOH) */}
          <div className={`border rounded-xl p-4 shadow-2xs ${
            disruption && disruption.impactedHub === activeHub
              ? 'bg-red-50/50 border-red-300'
              : 'bg-white border-[#E6E1D8]'
          }`}>
            <div className="flex items-center justify-between border-b border-[#EFECE6] pb-2 mb-3">
              <div className="font-display font-bold text-sm text-[#1E2022]">
                {activeHub} • {weather.hub.city}
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#C2410C]/10 text-[#C2410C] font-bold">
                TRANSIT HUB
              </span>
            </div>
            <div className="flex items-center justify-between my-2 text-xs">
              <span className="text-2xl font-bold font-display text-[#1E2022]">{weather.hub.temperatureC}°C</span>
              <span className="text-[#5A606A] text-right text-xs">
                {disruption && disruption.impactedHub === activeHub ? 'Severe Storm Front' : weather.hub.condition}
              </span>
            </div>
            <div className="space-y-1 text-xs text-[#5A606A] font-mono">
              <div className="flex justify-between">
                <span>Wind:</span> <strong>{weather.hub.wind}</strong>
              </div>
              <div className="flex justify-between">
                <span>Runways:</span> <strong>{weather.hub.runwayStatus.slice(0, 24)}</strong>
              </div>
            </div>
            <div className="mt-3 p-2 bg-[#F4F1EA] rounded font-mono text-[10px] text-[#6A717B] break-all">
              {weather.hub.metar}
            </div>
          </div>

          {/* Destination SYD */}
          <div className="bg-white border border-[#E6E1D8] rounded-xl p-4 shadow-2xs">
            <div className="flex items-center justify-between border-b border-[#EFECE6] pb-2 mb-3">
              <div className="font-display font-bold text-sm text-[#1E2022]">
                SYD • Sydney Kingsford
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                DESTINATION
              </span>
            </div>
            <div className="flex items-center justify-between my-2 text-xs">
              <span className="text-2xl font-bold font-display text-[#1E2022]">{weather.destination.temperatureC}°C</span>
              <span className="text-[#5A606A] text-right text-xs">{weather.destination.condition}</span>
            </div>
            <div className="space-y-1 text-xs text-[#5A606A] font-mono">
              <div className="flex justify-between">
                <span>Wind:</span> <strong>{weather.destination.wind}</strong>
              </div>
              <div className="flex justify-between">
                <span>Curfew:</span> <strong className="text-amber-700">Strict 23:00 Lockout</strong>
              </div>
            </div>
            <div className="mt-3 p-2 bg-[#F4F1EA] rounded font-mono text-[10px] text-[#6A717B] break-all">
              {weather.destination.metar}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
