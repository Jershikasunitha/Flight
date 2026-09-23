import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { AgentHeader } from './components/AgentHeader';
import { PlannerAgent } from './components/PlannerAgent';
import { MonitorAgent } from './components/MonitorAgent';
import { DecisionAgent } from './components/DecisionAgent';
import { ExecutionAgent } from './components/ExecutionAgent';
import { ViraChatbot } from './components/ViraChatbot';
import { ViraLogoModal } from './components/ViraLogoModal';
import { BackgroundFlightMotion } from './components/BackgroundFlightMotion';
import { AppIntro } from './components/AppIntro';
import { ToastContainer, ToastMessage } from './components/Toast';
import { WorldwideJourneyInput } from './components/WorldwideJourneyInput';
import { 
  HubCode, 
  DisruptionEvent, 
  TripState,
  WorldwideLocation
} from './types';
import { 
  HUB_OPTIONS, 
  INITIAL_WEATHER, 
  TRAVELER_PROFILE, 
  INITIAL_TELEMETRY,
  computeDecisionAnalysis,
  computeExecutionPlan,
  HISTORICAL_FLIGHT_DATA,
  getAgentDecisionLogs,
  buildWorldwideItineraries,
  buildWorldwideWeather,
  buildWorldwideTelemetry
} from './data/mockFlightData';
import { WORLDWIDE_LOCATIONS } from './data/worldwideLocations';
import { 
  Compass, 
  Activity, 
  GitBranch, 
  CheckCircle2, 
  ArrowRight, 
  Plane, 
  Sparkles, 
  ShieldAlert,
  Zap,
  Clock,
  Radio,
  Globe,
  X
} from 'lucide-react';
import { useLanguage } from './context/LanguageContext';
import { FloatingLanguageSelector } from './components/FloatingLanguageSelector';

export default function App() {
  const { t, isRTL } = useLanguage();
  const [currentTab, setCurrentTab] = useState<'overview' | 'planner' | 'monitor' | 'decision' | 'execution'>('overview');
  const [activeHub, setActiveHub] = useState<HubCode>('SIN');
  const [disruption, setDisruption] = useState<DisruptionEvent | null>(null);

  // Worldwide locations state: defaults to London LHR and Sydney SYD
  const [originLocation, setOriginLocation] = useState<WorldwideLocation>(() => {
    return WORLDWIDE_LOCATIONS.find((l) => l.code === 'LHR') || WORLDWIDE_LOCATIONS[0];
  });
  const [destinationLocation, setDestinationLocation] = useState<WorldwideLocation>(() => {
    return WORLDWIDE_LOCATIONS.find((l) => l.code === 'SYD') || WORLDWIDE_LOCATIONS[1];
  });
  const [isWorldwideSelectorOpen, setIsWorldwideSelectorOpen] = useState(false);

  // Build dynamic itineraries based on selected worldwide locations
  const worldwideItineraries = buildWorldwideItineraries(originLocation, destinationLocation);
  const activeItinerary = worldwideItineraries[activeHub] || HUB_OPTIONS[activeHub];

  const [telemetry, setTelemetry] = useState(() => 
    buildWorldwideTelemetry(originLocation, destinationLocation, activeHub, activeItinerary.leg1.flightNumber)
  );

  const [weather, setWeather] = useState(() => 
    buildWorldwideWeather(originLocation, activeHub, destinationLocation)
  );

  const [isScanning, setIsScanning] = useState(false);
  const [cycleCount, setCycleCount] = useState(1);
  const [lastScannedAt, setLastScannedAt] = useState('16:20 UTC');
  const [isNotified, setIsNotified] = useState(false);
  const [isViraOpen, setIsViraOpen] = useState(false);
  const [isViraLogoOpen, setIsViraLogoOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Update weather and telemetry when hub or locations change
  useEffect(() => {
    setWeather(buildWorldwideWeather(originLocation, activeHub, destinationLocation));
    setTelemetry(buildWorldwideTelemetry(originLocation, destinationLocation, activeHub, activeItinerary.leg1.flightNumber));
  }, [activeHub, originLocation, destinationLocation]);

  // Derived calculations
  const delay = disruption ? disruption.delayMinutes : 0;
  const connectionBufferMinutes = Math.max(0, activeItinerary.scheduledLayoverMinutes - delay);
  const decision = computeDecisionAnalysis(activeHub, disruption, originLocation, destinationLocation);
  const execution = computeExecutionPlan(activeHub, decision, disruption, originLocation, destinationLocation);

  // Consolidated trip state with Worldwide Origin & Destination
  const tripState: TripState = {
    activeHub,
    activeItinerary,
    originLocation,
    destinationLocation,
    disruption,
    connectionBufferMinutes,
    telemetry,
    weather,
    decision,
    execution,
    traveler: TRAVELER_PROFILE,
    monitoringCycleCount: cycleCount,
    lastScannedAt,
    historicalData: HISTORICAL_FLIGHT_DATA,
    decisionLogs: getAgentDecisionLogs(activeHub, disruption, cycleCount, originLocation, destinationLocation),
  };

  const addToast = (type: 'success' | 'warning' | 'info', title: string, description: string) => {
    const id = `toast-${Date.now()}`;
    setToasts((prev) => [...prev, { id, type, title, description }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleRunMonitoringCycle = () => {
    setIsScanning(true);
    setTimeout(() => {
      const now = new Date();
      const timeStr = now.toUTCString().slice(17, 22) + ' UTC';
      setCycleCount((c) => c + 1);
      setLastScannedAt(timeStr);
      setTelemetry((prev) => ({
        ...prev,
        groundSpeedKts: prev.groundSpeedKts + (Math.random() > 0.5 ? 4 : -3),
        distanceCoveredNm: prev.distanceCoveredNm + 18,
        distanceRemainingNm: Math.max(0, prev.distanceRemainingNm - 18),
      }));
      setIsScanning(false);
      addToast(
        'info',
        `${t.toastScanCycle} #${cycleCount + 1}`,
        `${t.toastScanDesc} (LHR → ${activeHub} → SYD)`
      );
    }, 1100);
  };

  const handleForceDisruption = (event: DisruptionEvent | null) => {
    setDisruption(event);
    setIsNotified(false);
    if (event) {
      addToast(
        'warning',
        `${t.toastDisruptionActive}: +${event.delayMinutes}m`,
        `${t.toastDisruptionDesc} (${event.title})`
      );
    } else {
      addToast(
        'success',
        t.toastDisruptionCleared,
        t.toastDisruptionClearedDesc
      );
    }
  };

  const handleNotifyTraveler = () => {
    setIsNotified(true);
    addToast(
      'success',
      t.toastTravelerNotified,
      `${t.toastTravelerNotifiedDesc} (${TRAVELER_PROFILE.name})`
    );
    // Ping VYRA: open chatbot
    setIsViraOpen(true);
  };

  const handleApplyReroute = (newHub: HubCode) => {
    setActiveHub(newHub);
    addToast(
      'info',
      `${t.toastCorridorSwitched} ${newHub}`,
      `${t.toastCorridorDesc} ${HUB_OPTIONS[newHub].name}.`
    );
  };

  return (
    <div 
      id="voya-root-layout" 
      dir={isRTL ? 'rtl' : 'ltr'}
      className="relative flex h-screen bg-[#F7F4EC] text-[#1E2022] overflow-hidden font-sans"
    >
      {/* Background Animated Flight Path & Moving Aircraft (Non-intrusive, pointer-events-none, strictly behind UI) */}
      <BackgroundFlightMotion 
        activeHub={activeHub} 
        originLocation={originLocation}
        destinationLocation={destinationLocation}
      />

      {/* Floating Language Selection Dropdown at the Top Right of Dashboard */}
      <FloatingLanguageSelector />

      {/* Warm Cream Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        activeHub={activeHub}
        traveler={TRAVELER_PROFILE}
        isDisrupted={!!disruption}
        onOpenVira={() => setIsViraOpen(true)}
        onPopViraLogo={() => setIsViraLogoOpen(true)}
        originLocation={originLocation}
        destinationLocation={destinationLocation}
      />

      {/* Main Operations Canvas */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#F7F4EC]/92 backdrop-blur-[1px] relative z-10">
        {/* Top Header */}
        <AgentHeader
          activeHub={activeHub}
          onSelectHub={handleApplyReroute}
          disruption={disruption}
          onRunMonitoringCycle={handleRunMonitoringCycle}
          isScanning={isScanning}
          cycleCount={cycleCount}
          lastScannedAt={lastScannedAt}
          onForceDisruption={handleForceDisruption}
          onPopViraLogo={() => setIsViraLogoOpen(true)}
          originLocation={originLocation}
          destinationLocation={destinationLocation}
          onOpenWorldwideSelector={() => setIsWorldwideSelectorOpen(true)}
        />

        {/* Scrollable Agent Workbenches */}
        <main id="voya-main-content" className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* OVERVIEW TAB: Full 4-Agent Cohesive Master View */}
          {currentTab === 'overview' && (
            <div className="space-y-6">
              {/* Agent Matrix Header in Cream */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-[#FAF8F3] border border-[#E0D9CB] p-5 rounded-xl shadow-2xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#C2410C]"></span>
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#C2410C]">
                      {t.matrixHeaderBadge}
                    </span>
                  </div>
                  <h1 className="text-2xl font-display font-bold text-[#1E2022] mt-1">
                    {t.dashboardTitle}
                  </h1>
                  <p className="text-xs text-[#5A606A] mt-0.5">
                    {t.dashboardDesc.replace('{name}', TRAVELER_PROFILE.name)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {/* Replay Intro Briefing Button */}
                  <button
                    id="overview-show-intro-btn"
                    onClick={() => setShowIntro(true)}
                    title="View professional mission intro"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white hover:bg-[#FAF8F3] text-[#5A606A] hover:text-[#1E2022] border border-[#E0D9CB] hover:border-[#C2410C] text-xs font-mono font-bold shadow-2xs transition-all active:scale-95"
                  >
                    <Compass className="w-3.5 h-3.5 text-amber-600" />
                    <span>Intro</span>
                  </button>

                  {/* VYRA Concierge Button */}
                  <button
                    id="overview-pop-vira-logo-btn"
                    onClick={() => setIsViraLogoOpen(true)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white hover:bg-[#FAF8F3] text-[#C2410C] border border-[#E0D9CB] hover:border-[#C2410C] text-xs font-mono font-bold shadow-2xs transition-all active:scale-95 group"
                  >
                    <Plane className="w-3.5 h-3.5 text-[#C2410C] animate-vira-plane" />
                    <span>VYRA</span>
                    <Sparkles className="w-3 h-3 text-amber-500 animate-spin" style={{ animationDuration: '7s' }} />
                  </button>

                  <button
                    id="overview-quick-monitor-btn"
                    onClick={handleRunMonitoringCycle}
                    disabled={isScanning}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#C2410C] hover:bg-[#A33408] text-white text-xs font-mono font-bold shadow-2xs transition-all active:scale-95"
                  >
                    <span>{isScanning ? t.scanning : t.runCycle}</span>
                    <span className="bg-black/20 px-1 rounded text-[10px]">#{cycleCount}</span>
                  </button>

                  <button
                    id="overview-open-vira-btn"
                    onClick={() => setIsViraOpen(true)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#1E2022] hover:bg-[#2C3035] text-white text-xs font-mono font-medium shadow-2xs transition-all"
                  >
                    <Plane className="w-3.5 h-3.5 -rotate-45 text-[#FB923C]" />
                    <span>{t.askVira}</span>
                  </button>
                </div>
              </div>

              {/* 4 Agent Cards Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 1. PLANNER AGENT SUMMARY CARD */}
                <div 
                  id="overview-card-planner"
                  className="bg-white border border-[#E0D9CB] rounded-xl p-5 shadow-2xs hover:border-[#C2410C]/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between border-b border-[#F0ECE1] pb-3 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-[#C2410C]/10 text-[#C2410C] flex items-center justify-center font-bold text-xs">
                          1
                        </div>
                        <div>
                          <h3 className="font-display font-bold text-sm text-[#1E2022]">Planner Agent</h3>
                          <span className="text-[10px] text-[#8C929A] font-mono">Itinerary & Hub Selection</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setCurrentTab('planner')}
                        className="text-xs font-mono text-[#C2410C] hover:underline flex items-center gap-1 font-semibold"
                      >
                        Workbench <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between bg-[#FAF8F3] p-2.5 rounded-lg border border-[#E0D9CB] font-mono">
                        <span className="text-[#8C929A]">Active Route:</span>
                        <div className="flex items-center gap-1.5 font-bold text-[#1E2022]">
                          <span>{originLocation.code || originLocation.city.slice(0,3).toUpperCase()}</span>
                          <ArrowRight className="w-3 h-3 text-[#C2410C]" />
                          <span className="text-[#C2410C] bg-white px-1.5 py-0.5 rounded border border-[#E0D9CB]">{activeHub}</span>
                          <ArrowRight className="w-3 h-3 text-[#C2410C]" />
                          <span>{destinationLocation.code || destinationLocation.city.slice(0,3).toUpperCase()}</span>
                          <span className="text-[11px] font-normal text-[#5A606A] ml-1">({activeItinerary.carrier})</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                        <div className="bg-[#FAF8F3] p-2 rounded border border-[#E0D9CB]">
                          <span className="text-[#8C929A] block text-[10px]">LEG 1 ({originLocation.city} → {activeHub})</span>
                          <strong>{activeItinerary.leg1.flightNumber}</strong> ({activeItinerary.leg1.aircraft})
                        </div>
                        <div className="bg-[#FAF8F3] p-2 rounded border border-[#E0D9CB]">
                          <span className="text-[#8C929A] block text-[10px]">LEG 2 ({activeHub} → {destinationLocation.city})</span>
                          <strong>{activeItinerary.leg2.flightNumber}</strong> ({activeItinerary.leg2.aircraft})
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-xs text-[#5A606A] pt-1">
                        <span>Total Flight Time: <strong className="text-[#1E2022]">{activeItinerary.totalFlightTime}</strong></span>
                        <span>Suite: <strong className="text-emerald-700">{activeItinerary.leg1.seat}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#F0ECE1] flex flex-wrap items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setIsWorldwideSelectorOpen(true)}
                      className="flex items-center gap-1 text-xs font-mono text-[#C2410C] font-bold hover:underline"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Change Boarding / Destination →</span>
                    </button>
                    <div className="flex items-center gap-1.5 font-mono text-xs">
                      <span className="text-[10px] text-[#8C929A] uppercase">Hub:</span>
                      {(['SIN', 'DXB', 'DOH'] as HubCode[]).map((hub) => (
                        <button
                          key={hub}
                          onClick={() => handleApplyReroute(hub)}
                          className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                            activeHub === hub ? 'bg-[#C2410C] text-white shadow-2xs' : 'bg-[#EFEBE1] text-[#5A606A] hover:bg-[#E2DCCE]'
                          }`}
                        >
                          {hub}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 2. MONITOR AGENT SUMMARY CARD */}
                <div 
                  id="overview-card-monitor"
                  className="bg-white border border-[#E0D9CB] rounded-xl p-5 shadow-2xs hover:border-[#C2410C]/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between border-b border-[#F0ECE1] pb-3 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-[#C2410C]/10 text-[#C2410C] flex items-center justify-center font-bold text-xs">
                          2
                        </div>
                        <div>
                          <h3 className="font-display font-bold text-sm text-[#1E2022]">Monitor Agent</h3>
                          <span className="text-[10px] text-[#8C929A] font-mono">Telemetry & Disruption Tracking</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setCurrentTab('monitor')}
                        className="text-xs font-mono text-[#C2410C] hover:underline flex items-center gap-1 font-semibold"
                      >
                        Workbench <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className={`p-2.5 rounded-lg border font-mono flex items-center justify-between ${
                        disruption ? 'bg-red-50 border-red-200 text-red-900' : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      }`}>
                        <span>Flight Status:</span>
                        <strong className="font-bold">
                          {disruption ? `ALERT: +${disruption.delayMinutes}m (${disruption.type})` : 'NOMINAL • ON SCHEDULE'}
                        </strong>
                      </div>

                      <div className="grid grid-cols-3 gap-2 font-mono text-center text-[11px]">
                        <div className="bg-[#FAF8F3] p-2 rounded border border-[#E0D9CB]">
                          <span className="text-[9px] text-[#8C929A] block uppercase">Altitude</span>
                          <strong>{telemetry.altitudeFt.toLocaleString()} ft</strong>
                        </div>
                        <div className="bg-[#FAF8F3] p-2 rounded border border-[#E0D9CB]">
                          <span className="text-[9px] text-[#8C929A] block uppercase">Speed</span>
                          <strong>{telemetry.groundSpeedKts} kts</strong>
                        </div>
                        <div className={`p-2 rounded border ${
                          connectionBufferMinutes < 45 ? 'bg-red-50 border-red-300 text-red-700 font-bold' : 'bg-[#FAF8F3] border-[#E0D9CB]'
                        }`}>
                          <span className="text-[9px] text-[#8C929A] block uppercase">Buffer</span>
                          <strong>{connectionBufferMinutes}m</strong>
                        </div>
                      </div>

                      <p className="text-[11px] text-[#5A606A] leading-relaxed line-clamp-1">
                        Waypoint: {telemetry.currentWaypoint} • METAR {weather.hub.airportCode}: {weather.hub.condition}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#F0ECE1] flex items-center justify-between">
                    <span className="text-[11px] text-[#8C929A]">Stress Test:</span>
                    <button
                      onClick={() => setCurrentTab('monitor')}
                      className="text-xs font-mono text-[#C2410C] font-semibold hover:underline"
                    >
                      Force Storm / ATC Hold →
                    </button>
                  </div>
                </div>

                {/* 3. DECISION AGENT SUMMARY CARD */}
                <div 
                  id="overview-card-decision"
                  className="bg-white border border-[#E0D9CB] rounded-xl p-5 shadow-2xs hover:border-[#C2410C]/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between border-b border-[#F0ECE1] pb-3 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-[#C2410C]/10 text-[#C2410C] flex items-center justify-center font-bold text-xs">
                          3
                        </div>
                        <div>
                          <h3 className="font-display font-bold text-sm text-[#1E2022]">Decision Agent</h3>
                          <span className="text-[10px] text-[#8C929A] font-mono">Risk Scoring & Logic Tree</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setCurrentTab('decision')}
                        className="text-xs font-mono text-[#C2410C] hover:underline flex items-center gap-1 font-semibold"
                      >
                        Workbench <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="space-y-2.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[#8C929A]">Risk Score:</span>
                        <span className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                          decision.riskScore >= 70 ? 'bg-red-100 text-red-800' : decision.riskScore >= 35 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {decision.riskLevel} ({decision.riskScore}/100)
                        </span>
                      </div>

                      <div className="w-full bg-[#EFEBE1] h-2 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${
                            decision.riskScore >= 70 ? 'bg-[#DC2626]' : decision.riskScore >= 35 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${decision.riskScore}%` }}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-[#5A606A] pt-1">
                        <div>Misconnect Prob: <strong className="text-[#1E2022]">{decision.connectionFailureProbability}%</strong></div>
                        <div>Curfew Margin: <strong className="text-[#1E2022]">{decision.curfewMarginMinutes}m</strong></div>
                      </div>

                      <div className="p-2 bg-[#FAF8F3] rounded border border-[#E0D9CB] text-[11px] text-[#5A606A]">
                        Decision-Tree: <strong>Step 4: {decision.decisionTree[3]?.result.slice(0, 50)}...</strong>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#F0ECE1] flex items-center justify-between">
                    <span className="text-[11px] text-[#8C929A]">Route Comparison:</span>
                    <button
                      onClick={() => setCurrentTab('decision')}
                      className="text-xs font-mono text-[#C2410C] font-semibold hover:underline"
                    >
                      View 3-Hub Matrix →
                    </button>
                  </div>
                </div>

                {/* 4. EXECUTION AGENT SUMMARY CARD */}
                <div 
                  id="overview-card-execution"
                  className="bg-white border border-[#E0D9CB] rounded-xl p-5 shadow-2xs hover:border-[#C2410C]/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between border-b border-[#F0ECE1] pb-3 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-[#C2410C]/10 text-[#C2410C] flex items-center justify-center font-bold text-xs">
                          4
                        </div>
                        <div>
                          <h3 className="font-display font-bold text-sm text-[#1E2022]">Execution Agent</h3>
                          <span className="text-[10px] text-[#8C929A] font-mono">Action Plan & Traveler Dispatch</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setCurrentTab('execution')}
                        className="text-xs font-mono text-[#C2410C] hover:underline flex items-center gap-1 font-semibold"
                      >
                        Workbench <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="font-display font-bold text-sm text-[#1E2022] line-clamp-1">
                        {execution.actionTitle}
                      </div>

                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-[#8C929A]">System Confidence:</span>
                        <span className="font-bold text-[#D97706]">{execution.confidenceScore}% High Reliability</span>
                      </div>

                      <div className="w-full bg-[#EFEBE1] h-2 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-amber-500 to-[#C2410C]"
                          style={{ width: `${execution.confidenceScore}%` }}
                        />
                      </div>

                      <p className="text-[11px] text-[#5A606A] leading-relaxed line-clamp-2">
                        {execution.actionSummary}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#F0ECE1] flex items-center justify-between">
                    <button
                      id="overview-notify-traveler-btn"
                      onClick={handleNotifyTraveler}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all shadow-2xs ${
                        isNotified 
                          ? 'bg-emerald-600 text-white' 
                          : 'bg-[#C2410C] hover:bg-[#A33408] text-white'
                      }`}
                    >
                      {isNotified ? '✓ Traveler Synced' : 'Notify Traveler & Ping VYRA'}
                    </button>
                    <span className="text-[11px] font-mono text-[#8C929A]">
                      {isNotified ? 'Pushed to Apple Wallet' : 'Ready to Dispatch'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: PLANNER AGENT WORKBENCH */}
          {currentTab === 'planner' && (
            <PlannerAgent
              activeHub={activeHub}
              onSelectHub={handleApplyReroute}
              traveler={TRAVELER_PROFILE}
              originLocation={originLocation}
              destinationLocation={destinationLocation}
              onChangeOrigin={(loc) => {
                setOriginLocation(loc);
                addToast('info', 'Boarding Point Updated', `${loc.name} (${loc.country}) selected`);
              }}
              onChangeDestination={(loc) => {
                setDestinationLocation(loc);
                addToast('info', 'Destination Updated', `${loc.name} (${loc.country}) selected`);
              }}
              worldwideItineraries={worldwideItineraries}
            />
          )}

          {/* TAB 2: MONITOR AGENT WORKBENCH */}
          {currentTab === 'monitor' && (
            <MonitorAgent
              activeHub={activeHub}
              disruption={disruption}
              onForceDisruption={handleForceDisruption}
              onRunMonitoringCycle={handleRunMonitoringCycle}
              isScanning={isScanning}
              cycleCount={cycleCount}
              lastScannedAt={lastScannedAt}
              telemetry={telemetry}
              weather={weather}
              connectionBufferMinutes={connectionBufferMinutes}
            />
          )}

          {/* TAB 3: DECISION AGENT WORKBENCH */}
          {currentTab === 'decision' && (
            <DecisionAgent
              decision={decision}
              activeHub={activeHub}
              disruption={disruption}
              onApplyReroute={handleApplyReroute}
              originLocation={originLocation}
              destinationLocation={destinationLocation}
            />
          )}

          {/* TAB 4: EXECUTION AGENT WORKBENCH */}
          {currentTab === 'execution' && (
            <ExecutionAgent
              execution={execution}
              traveler={TRAVELER_PROFILE}
              activeHub={activeHub}
              onNotifyTraveler={handleNotifyTraveler}
              isNotified={isNotified}
              onOpenVira={() => setIsViraOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Worldwide Route Selector Modal */}
      {isWorldwideSelectorOpen && (
        <div 
          id="worldwide-selector-modal"
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setIsWorldwideSelectorOpen(false)}
        >
          <div 
            className="bg-[#F7F4EC] border border-[#DDD6C8] rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#E6E1D8] pb-3">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#C2410C]" />
                <h3 className="font-display font-bold text-lg text-[#1E2022]">
                  Select Boarding Point & Destination Worldwide
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsWorldwideSelectorOpen(false)}
                className="p-1.5 rounded-lg hover:bg-[#EFECE6] text-[#5A606A] hover:text-[#1E2022] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <WorldwideJourneyInput
              origin={originLocation}
              destination={destinationLocation}
              onChangeOrigin={(loc) => {
                setOriginLocation(loc);
                addToast('info', 'Boarding Point Updated', `${loc.name} (${loc.country}) selected`);
              }}
              onChangeDestination={(loc) => {
                setDestinationLocation(loc);
                addToast('info', 'Destination Updated', `${loc.name} (${loc.country}) selected`);
              }}
            />

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setIsWorldwideSelectorOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-[#C2410C] hover:bg-[#A33408] text-white font-mono font-bold text-xs shadow-sm transition-all"
              >
                Apply Route & Return to Operations
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating VYRA Chatbot (Plane-Shaped Trigger bottom-right) */}
      <ViraChatbot
        isOpen={isViraOpen}
        onToggle={() => setIsViraOpen(!isViraOpen)}
        tripState={tripState}
        onOpenStateReview={() => setCurrentTab('execution')}
        onPopLogo={() => setIsViraLogoOpen(true)}
      />

      {/* VYRA Logo Showcase Pop-Up Modal */}
      <ViraLogoModal
        isOpen={isViraLogoOpen}
        onClose={() => setIsViraLogoOpen(false)}
        onOpenChat={() => {
          setIsViraLogoOpen(false);
          setIsViraOpen(true);
        }}
        tripState={tripState}
      />

      {/* Professional App Intro & Mission Briefing Screen */}
      {showIntro && (
        <AppIntro
          onComplete={() => setShowIntro(false)}
          tripState={tripState}
          onSelectHub={handleApplyReroute}
          onForceDisruption={handleForceDisruption}
        />
      )}

      {/* Toast Alert System */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
