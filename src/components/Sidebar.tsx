import { useState, useEffect } from 'react';
import { 
  Compass, 
  Activity, 
  GitBranch, 
  CheckCircle2, 
  LayoutDashboard, 
  Plane, 
  ShieldAlert, 
  User, 
  Radio,
  Sparkles
} from 'lucide-react';
import { TravelerProfile, HubCode, WorldwideLocation } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelector } from './LanguageSelector';

interface SidebarProps {
  currentTab: 'overview' | 'planner' | 'monitor' | 'decision' | 'execution';
  onSelectTab: (tab: 'overview' | 'planner' | 'monitor' | 'decision' | 'execution') => void;
  activeHub: HubCode;
  traveler: TravelerProfile;
  isDisrupted: boolean;
  onOpenVira: () => void;
  onPopViraLogo: () => void;
  originLocation?: WorldwideLocation;
  destinationLocation?: WorldwideLocation;
}

export function Sidebar({
  currentTab,
  onSelectTab,
  activeHub,
  traveler,
  isDisrupted,
  onOpenVira,
  onPopViraLogo,
  originLocation,
  destinationLocation,
}: SidebarProps) {
  const { t } = useLanguage();
  const [utcTime, setUtcTime] = useState('');
  const [destTime, setDestTime] = useState('');

  const destCode = destinationLocation?.code || destinationLocation?.city?.slice(0, 3).toUpperCase() || 'SYD';
  const origCode = originLocation?.code || originLocation?.city?.slice(0, 3).toUpperCase() || 'LHR';

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toUTCString().slice(17, 22) + ' UTC');
      // Approximate destination timezone from longitude
      const lng = destinationLocation?.coordinates?.lng ?? 151.17;
      const hoursOffset = Math.round(lng / 15);
      const targetOffset = new Date(now.getTime() + (hoursOffset * 3600 * 1000));
      setDestTime(targetOffset.toUTCString().slice(17, 22) + ' ' + destCode);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [destinationLocation, destCode]);

  const navItems = [
    { id: 'overview', label: t.opsOverview, icon: LayoutDashboard, badge: '4 Agents' },
    { id: 'planner', label: t.plannerAgent, icon: Compass, badge: `${origCode} → ${activeHub} → ${destCode}` },
    { id: 'monitor', label: t.monitorAgent, icon: Activity, badge: isDisrupted ? 'ALERT' : 'Live' },
    { id: 'decision', label: t.decisionAgent, icon: GitBranch, badge: 'Risk Tree' },
    { id: 'execution', label: t.executionAgent, icon: CheckCircle2, badge: 'Action Plan' },
  ] as const;

  return (
    <aside 
      id="voya-sidebar" 
      className="w-72 bg-[#F5F1E8]/95 backdrop-blur-xs text-[#1E2022] flex flex-col justify-between border-r border-[#E0D9CB] select-none shrink-0 relative z-10"
    >
      <div className="overflow-y-auto">
        {/* Brand Header */}
        <div className="p-5 border-b border-[#E0D9CB]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <button 
                id="sidebar-voya-logo-btn"
                onClick={onPopViraLogo}
                title="Click to view VYRA Identity & Specifications"
                className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#A33408] via-[#C2410C] to-[#EA580C] hover:opacity-95 flex items-center justify-center text-white shadow-md shadow-[#C2410C]/25 transition-transform hover:scale-105 active:scale-95 animate-vira-badge"
              >
                <Plane className="w-5 h-5 text-white animate-vira-plane" />
              </button>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-display font-bold text-xl tracking-tight text-[#1E2022]">VOYA</span>
                  <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#C2410C]/15 text-[#C2410C] font-mono font-bold">OPS v4.2</span>
                </div>
                <p className="text-[11px] text-[#6A717B] leading-tight">{t.brandSubtitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="relative flex h-2.5 w-2.5">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isDisrupted ? 'bg-amber-400' : 'bg-emerald-400'} opacity-75`}></span>
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isDisrupted ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
              </span>
            </div>
          </div>

          {/* Clocks */}
          <div className="mt-4 grid grid-cols-2 gap-2 text-center bg-[#FAF8F3] p-2 rounded-lg border border-[#E0D9CB]">
            <div>
              <span className="text-[10px] text-[#8C929A] block font-mono">ZULU TIME</span>
              <span className="text-xs font-mono font-bold text-[#1E2022] tracking-wider">{utcTime || '16:20 UTC'}</span>
            </div>
            <div className="border-l border-[#E0D9CB]">
              <span className="text-[10px] text-[#8C929A] block font-mono">DESTINATION</span>
              <span className="text-xs font-mono font-bold text-[#D97706] tracking-wider">{destTime || '02:20 ' + destCode}</span>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="p-3">
          <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-[#737A84] font-semibold flex items-center justify-between">
            <span>Agent Control Matrix</span>
            <Radio className="w-3 h-3 text-[#C2410C] animate-pulse" />
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${
                    isActive 
                      ? 'bg-[#C2410C] text-white shadow-2xs font-semibold' 
                      : 'text-[#4A5059] hover:bg-[#EAE4D6] hover:text-[#1E2022]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#737A84]'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded shrink-0 ${
                    isActive 
                      ? 'bg-black/20 text-white' 
                      : item.badge === 'ALERT'
                        ? 'bg-red-100 text-red-800 font-bold'
                        : 'bg-[#EAE4D6] text-[#6A717B]'
                  }`}>
                    {item.badge}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Traveler Dossier Box */}
        <div className="px-4 py-2">
          <div className="bg-[#FAF8F3] border border-[#E0D9CB] rounded-lg p-3 shadow-2xs">
            <div className="flex items-center gap-2 mb-1.5">
              <User className="w-3.5 h-3.5 text-[#C2410C]" />
              <span className="text-xs font-semibold text-[#1E2022]">{t.passenger} Dossier</span>
            </div>
            <div className="text-xs font-display font-medium text-[#1E2022]">{traveler.name}</div>
            <div className="mt-1 flex items-center justify-between text-[11px] font-mono text-[#6A717B]">
              <span>PNR: <strong className="text-[#1E2022]">{traveler.pnr}</strong></span>
              <span className="text-[#0284C7] font-semibold">{traveler.loyaltyTier.split('/')[0]}</span>
            </div>
            <div className="mt-2 text-[10px] text-[#5A606A] bg-[#EFEBE1] px-2 py-1 rounded border border-[#E0D9CB]">
              Pref: {traveler.preferredSeat} • Min Buffer: {traveler.minTransferPreferenceMinutes}m
            </div>
          </div>
        </div>

        {/* Language Selection in Sidebar */}
        <div className="px-4 py-2">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#737A84] font-semibold mb-1.5 flex items-center justify-between">
            <span>{t.languageSelect}</span>
            <span className="text-[9px] bg-[#E0D9CB] text-[#1E2022] px-1 rounded">11</span>
          </div>
          <LanguageSelector variant="full" />
        </div>

        {/* VYRA Concierge Action */}
        <div className="px-4 py-2 space-y-2">
          {/* VYRA Trigger */}
          <button
            id="sidebar-pop-vira-logo"
            onClick={onPopViraLogo}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-[#FAF8F3] hover:bg-[#FFFFFF] border border-[#E0D9CB] hover:border-[#C2410C] text-xs text-[#1E2022] transition-all group shadow-2xs"
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#C2410C] text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plane className="w-3.5 h-3.5 -rotate-45" />
              </div>
              <div className="text-left">
                <div className="font-bold text-xs text-[#1E2022] flex items-center gap-1">
                  <span>VYRA</span>
                  <Sparkles className="w-3 h-3 text-[#D97706]" />
                </div>
                <div className="text-[10px] text-[#737A84]">{t.viraRole}</div>
              </div>
            </div>
            <span className="text-[10px] font-mono text-[#C2410C] bg-[#C2410C]/10 px-1.5 py-0.5 rounded font-bold">AI OPS</span>
          </button>

          {/* Quick Launch VYRA Chat */}
          <button
            id="sidebar-launch-vira"
            onClick={onOpenVira}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-[#1E2022] hover:bg-[#2C3035] text-xs text-white transition-all group shadow-2xs"
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-white/20 text-[#FB923C] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plane className="w-3.5 h-3.5 -rotate-45" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-white">{t.openVira}</div>
                <div className="text-[10px] text-gray-300">Live Telemetry & Intelligence</div>
              </div>
            </div>
            <span className="text-[10px] font-mono text-[#FB923C] bg-white/10 px-1.5 py-0.5 rounded">CHAT</span>
          </button>
        </div>
      </div>

      {/* Footer Caveat & System Notice */}
      <div className="p-4 border-t border-[#E0D9CB] bg-[#ECE7DC] shrink-0">
        <div className="flex items-start gap-2 text-[11px] text-[#5A606A] leading-relaxed">
          <ShieldAlert className="w-4 h-4 text-[#8C929A] shrink-0 mt-0.5" />
          <p>
            <span className="font-semibold text-[#1E2022]">Telemetry Notice:</span> Flight radar and METAR are emulated for real-time autonomous ops simulation.
          </p>
        </div>
        <div className="mt-2.5 pt-2 border-t border-[#DDD6C8] flex items-center justify-between text-[10px] font-mono text-[#737A84]">
          <span>VOYA DISPATCH v4.2</span>
          <span>LATENCY: 18ms</span>
        </div>
      </div>
    </aside>
  );
}
