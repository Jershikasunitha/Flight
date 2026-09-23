import { 
  AlertTriangle, 
  RotateCw, 
  CheckCircle2, 
  ArrowRight,
  Plane,
  Sparkles,
  Globe,
  MapPin
} from 'lucide-react';
import { HubCode, DisruptionEvent, WorldwideLocation } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelector } from './LanguageSelector';

interface AgentHeaderProps {
  activeHub: HubCode;
  onSelectHub: (hub: HubCode) => void;
  disruption: DisruptionEvent | null;
  onRunMonitoringCycle: () => void;
  isScanning: boolean;
  cycleCount: number;
  lastScannedAt: string;
  onForceDisruption: (disruption: DisruptionEvent | null) => void;
  onPopViraLogo?: () => void;
  originLocation?: WorldwideLocation;
  destinationLocation?: WorldwideLocation;
  onOpenWorldwideSelector?: () => void;
}

export function AgentHeader({
  activeHub,
  onSelectHub,
  disruption,
  onRunMonitoringCycle,
  isScanning,
  cycleCount,
  lastScannedAt,
  onPopViraLogo,
  originLocation,
  destinationLocation,
  onOpenWorldwideSelector,
}: AgentHeaderProps) {
  const { t } = useLanguage();

  const hubNames: Record<HubCode, { name: string; carrier: string }> = {
    SIN: { name: 'Singapore (SIN)', carrier: 'Singapore Airlines' },
    DXB: { name: 'Dubai (DXB)', carrier: 'Emirates' },
    DOH: { name: 'Doha (DOH)', carrier: 'Qatar Airways' },
  };

  const origCode = originLocation?.code || originLocation?.city?.slice(0, 3).toUpperCase() || 'LHR';
  const destCode = destinationLocation?.code || destinationLocation?.city?.slice(0, 3).toUpperCase() || 'SYD';
  const origCity = originLocation?.city || 'London';
  const destCity = destinationLocation?.city || 'Sydney';

  return (
    <header id="voya-header" className="bg-[#FAF8F3] border-b border-[#E0D9CB] px-4 sm:px-6 py-3.5">
      {/* Top Bar: Route & Hub Selector & Ops Actions & Language */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Route Details */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenWorldwideSelector}
            title="Click to edit Boarding Point or Destination across all countries worldwide"
            className="flex items-center gap-2 bg-[#EFEBE1] hover:bg-white border border-[#DDD6C8] hover:border-[#C2410C] px-3 py-1.5 rounded-lg text-xs font-mono shadow-2xs transition-all text-left group"
          >
            <span className="text-sm shrink-0">{originLocation?.flag || '🛫'}</span>
            <span className="font-bold text-[#1E2022] group-hover:text-[#C2410C]">{origCode}</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#8C929A] rtl:rotate-180 shrink-0" />
            <span className="font-bold text-[#C2410C] bg-white px-1.5 py-0.5 rounded shadow-2xs border border-[#E0D9CB]">
              {activeHub}
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-[#8C929A] rtl:rotate-180 shrink-0" />
            <span className="text-sm shrink-0">{destinationLocation?.flag || '🛬'}</span>
            <span className="font-bold text-[#1E2022] group-hover:text-[#C2410C]">{destCode}</span>
            <span className="text-[10px] text-[#C2410C] font-semibold underline ml-1 hidden sm:inline">Change</span>
          </button>

          <div className="hidden sm:block text-xs text-[#5A606A]">
            <span className="font-semibold text-[#1E2022]">{origCity} → {destCity}</span>
            <span className="mx-1.5 text-[#B0B7C0]">•</span>
            <span>via {hubNames[activeHub].name}</span>
          </div>
        </div>

        {/* Right side: Language Selector, VYRA Button, Hub Switcher, Run Cycle */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Universal Language Selector */}
          <LanguageSelector variant="compact" />

          {/* VYRA Button */}
          {onPopViraLogo && (
            <button
              id="header-pop-vira-logo-btn"
              onClick={onPopViraLogo}
              title="View VYRA concierge & specifications"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF8F3] hover:bg-white border border-[#E0D9CB] hover:border-[#C2410C] text-xs font-mono font-medium text-[#1E2022] transition-all shadow-2xs active:scale-95 group"
            >
              <div className="w-4 h-4 rounded bg-[#C2410C] text-white flex items-center justify-center animate-vira-badge">
                <Plane className="w-2.5 h-2.5 text-white animate-vira-plane" />
              </div>
              <span className="font-bold text-[#C2410C]">VYRA</span>
              <Sparkles className="w-3 h-3 text-amber-500" />
            </button>
          )}

          {/* Hub Selector Pills */}
          <div className="flex items-center bg-[#EAE5DA] p-1 rounded-lg border border-[#DDD6C8] text-xs font-mono">
            {(['SIN', 'DXB', 'DOH'] as HubCode[]).map((hub) => (
              <button
                key={hub}
                id={`hub-select-${hub}`}
                onClick={() => onSelectHub(hub)}
                className={`px-2.5 py-1 rounded-md font-bold transition-all ${
                  activeHub === hub
                    ? 'bg-[#C2410C] text-white shadow-2xs'
                    : 'text-[#5A606A] hover:text-[#1E2022] hover:bg-[#DDD8CF]'
                }`}
              >
                {hub}
              </button>
            ))}
          </div>

          {/* Trigger Cycle Button */}
          <button
            id="run-monitor-cycle-header"
            onClick={onRunMonitoringCycle}
            disabled={isScanning}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1E2022] hover:bg-[#2C3035] text-white text-xs font-mono font-medium transition-all shadow-2xs active:scale-95 disabled:opacity-75"
          >
            <RotateCw className={`w-3.5 h-3.5 text-[#FB923C] ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? t.scanning : t.runCycle}</span>
            <span className="text-[10px] bg-white/20 px-1 rounded ml-0.5">#{cycleCount}</span>
          </button>
        </div>
      </div>

      {/* Disruption Alert Strip if Active */}
      {disruption && (
        <div 
          id="active-disruption-banner"
          className="mt-3 bg-[#FEF2F2] border border-[#FCA5A5] rounded-lg p-3 text-xs flex items-start justify-between gap-3 text-[#991B1B] animate-fade-in"
        >
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5 animate-bounce" />
            <div>
              <div className="font-semibold font-display flex items-center gap-2">
                <span>{t.activeDisruption}: {disruption.title}</span>
                <span className="bg-[#DC2626] text-white text-[10px] px-1.5 py-0.2 rounded font-mono font-bold">
                  +{disruption.delayMinutes} {t.delayNotice}
                </span>
              </div>
              <p className="mt-0.5 text-[#7F1D1D] leading-relaxed text-[11px]">
                {disruption.description}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] font-mono bg-white/80 border border-[#FCA5A5] px-2 py-1 rounded text-[#991B1B]">
              {t.bufferCritical}
            </span>
          </div>
        </div>
      )}

      {/* Nominal Ops Bar if No Disruption */}
      {!disruption && (
        <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono text-[#6A717B]">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t.allNominal}</span>
          </div>
          <div className="flex items-center gap-3">
            <span>{t.lastSync}: <strong className="text-[#1E2022]">{lastScannedAt}</strong></span>
            <span>{t.bufferMargin}: <strong className="text-emerald-700 font-bold">{t.healthy}</strong></span>
          </div>
        </div>
      )}
    </header>
  );
}
