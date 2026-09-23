import { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Plane, 
  ArrowRight, 
  ShieldCheck, 
  AlertTriangle, 
  RotateCcw,
  Globe,
  Search,
  X,
  Check,
  PlaneTakeoff,
  Layers,
  Sparkles
} from 'lucide-react';
import { HubCode, TripState, DisruptionEvent } from '../types';
import { DISRUPTION_PRESETS, HUB_OPTIONS } from '../data/mockFlightData';
import { useLanguage } from '../context/LanguageContext';

interface AirlineCountryFlight {
  id: string;
  name: string;
  iata: string;
  country: string;
  flag: string;
  region: 'Asia-Pacific' | 'Middle East' | 'Europe' | 'Americas';
  alliance: 'Star Alliance' | 'Oneworld' | 'SkyTeam' | 'Independent';
  hubAirport: string;
  flagshipAircraft: string;
  primaryCorridors: string[];
  hubCode?: HubCode;
  specialty: string;
}

const AIRLINES_AND_COUNTRY_FLIGHTS: AirlineCountryFlight[] = [
  {
    id: 'sq',
    name: 'Singapore Airlines',
    iata: 'SQ',
    country: 'Singapore',
    flag: '🇸🇬',
    region: 'Asia-Pacific',
    alliance: 'Star Alliance',
    hubAirport: 'SIN (Singapore Changi T2/T3)',
    flagshipAircraft: 'Airbus A350-900 / A380-800 Suites',
    primaryCorridors: ['LHR → SIN → SYD', 'SIN → JFK Non-Stop', 'SIN → FRA → JFK', 'SIN → NRT'],
    hubCode: 'SIN',
    specialty: 'KrisFlyer Solitaire priority, award-winning First suites, +325m curfew margin',
  },
  {
    id: 'qr',
    name: 'Qatar Airways',
    iata: 'QR',
    country: 'Qatar',
    flag: '🇶🇦',
    region: 'Middle East',
    alliance: 'Oneworld',
    hubAirport: 'DOH (Hamad International)',
    flagshipAircraft: 'Airbus A350-1000 / Boeing 787-9',
    primaryCorridors: ['LHR → DOH → SYD', 'DOH → LAX', 'DOH → CDG', 'DOH → AKL'],
    hubCode: 'DOH',
    specialty: 'Patented Qsuite solo privacy door, 94.2% historical OTP, Al Safwa First Lounge',
  },
  {
    id: 'ek',
    name: 'Emirates',
    iata: 'EK',
    country: 'United Arab Emirates',
    flag: '🇦🇪',
    region: 'Middle East',
    alliance: 'Independent',
    hubAirport: 'DXB (Dubai International T3)',
    flagshipAircraft: 'Airbus A380-800 / Boeing 777-300ER',
    primaryCorridors: ['LHR → DXB → SYD', 'DXB → JFK', 'DXB → BKK', 'DXB → JNB'],
    hubCode: 'DXB',
    specialty: 'A380 Shower Spa & Onboard Lounge, direct Concourse A gate boarding',
  },
  {
    id: 'ba',
    name: 'British Airways',
    iata: 'BA',
    country: 'United Kingdom',
    flag: '🇬🇧',
    region: 'Europe',
    alliance: 'Oneworld',
    hubAirport: 'LHR (London Heathrow T5/T3)',
    flagshipAircraft: 'Airbus A350-1000 / Boeing 777-300ER',
    primaryCorridors: ['LHR → SIN → SYD (Kangaroo Route)', 'LHR → JFK', 'LHR → HND', 'LHR → DXB'],
    specialty: 'Club Suite with sliding privacy door, Concorde Room VIP access, Oneworld flag carrier',
  },
  {
    id: 'qf',
    name: 'Qantas',
    iata: 'QF',
    country: 'Australia',
    flag: '🇦🇺',
    region: 'Asia-Pacific',
    alliance: 'Oneworld',
    hubAirport: 'SYD (Sydney Kingsford Smith T1)',
    flagshipAircraft: 'Boeing 787-9 / Airbus A380 / A350-1000ULR',
    primaryCorridors: ['SYD → LHR Non-stop & via PER/SIN', 'SYD → LAX', 'MEL → DFW', 'SYD → HND'],
    specialty: 'Project Sunrise ultra-long-haul, Chairman\'s Lounge, Kangaroo Route pioneer',
  },
  {
    id: 'cx',
    name: 'Cathay Pacific',
    iata: 'CX',
    country: 'Hong Kong',
    flag: '🇭🇰',
    region: 'Asia-Pacific',
    alliance: 'Oneworld',
    hubAirport: 'HKG (Hong Kong Chek Lap Kok)',
    flagshipAircraft: 'Airbus A350-1000 / Boeing 777-300ER',
    primaryCorridors: ['LHR → HKG → SYD', 'HKG → JFK Polar', 'HKG → YVR', 'HKG → MEL'],
    specialty: 'The Pier First Lounge, Aria Suite business class, Asian trunk connectivity',
  },
  {
    id: 'nh',
    name: 'All Nippon Airways (ANA)',
    iata: 'NH',
    country: 'Japan',
    flag: '🇯🇵',
    region: 'Asia-Pacific',
    alliance: 'Star Alliance',
    hubAirport: 'HND (Tokyo Haneda) / NRT (Narita)',
    flagshipAircraft: 'Boeing 777-300ER "The Room" / B787-9',
    primaryCorridors: ['HND → LHR', 'HND → SYD', 'HND → JFK', 'HND → FRA'],
    specialty: '5-Star Skytrax, ultra-wide "The Room" suites, exceptional punctuality',
  },
  {
    id: 'jl',
    name: 'Japan Airlines (JAL)',
    iata: 'JL',
    country: 'Japan',
    flag: '🇯🇵',
    region: 'Asia-Pacific',
    alliance: 'Oneworld',
    hubAirport: 'HND (Tokyo Haneda) / NRT (Narita)',
    flagshipAircraft: 'Airbus A350-1000 / Boeing 787-9',
    primaryCorridors: ['HND → LHR', 'HND → SYD', 'HND → DFW', 'HND → CDG'],
    specialty: 'New A350-1000 First Class suites with built-in headrest sound, Omotenashi hospitality',
  },
  {
    id: 'lh',
    name: 'Lufthansa',
    iata: 'LH',
    country: 'Germany',
    flag: '🇩🇪',
    region: 'Europe',
    alliance: 'Star Alliance',
    hubAirport: 'FRA (Frankfurt) / MUC (Munich)',
    flagshipAircraft: 'Boeing 747-8i "Queen of the Skies" / A350-900',
    primaryCorridors: ['FRA → SIN → SYD', 'FRA → JFK', 'MUC → HND', 'FRA → EZE'],
    specialty: 'First Class Terminal with Porsche tarmac transfer, Allegris premium cabin',
  },
  {
    id: 'af',
    name: 'Air France',
    iata: 'AF',
    country: 'France',
    flag: '🇫🇷',
    region: 'Europe',
    alliance: 'SkyTeam',
    hubAirport: 'CDG (Paris Charles de Gaulle T2E)',
    flagshipAircraft: 'Airbus A350-900 / Boeing 777-300ER',
    primaryCorridors: ['CDG → SIN → SYD', 'CDG → JFK', 'CDG → HND', 'CDG → JNB'],
    specialty: 'La Première luxury suites, curated Michelin gastronomy, SkyTeam European cornerstone',
  },
  {
    id: 'ey',
    name: 'Etihad Airways',
    iata: 'EY',
    country: 'United Arab Emirates',
    flag: '🇦🇪',
    region: 'Middle East',
    alliance: 'Independent',
    hubAirport: 'AUH (Abu Dhabi Zayed Intl)',
    flagshipAircraft: 'Airbus A350-1000 / Boeing 787-10',
    primaryCorridors: ['LHR → AUH → SYD', 'AUH → JFK', 'AUH → MEL', 'AUH → BOM'],
    specialty: 'The Residence 3-room suite, US pre-clearance immigration facility at Abu Dhabi',
  },
  {
    id: 'ua',
    name: 'United Airlines',
    iata: 'UA',
    country: 'United States',
    flag: '🇺🇸',
    region: 'Americas',
    alliance: 'Star Alliance',
    hubAirport: 'SFO / ORD / EWR',
    flagshipAircraft: 'Boeing 777-300ER / Boeing 787-9',
    primaryCorridors: ['SFO → SYD Non-Stop', 'SFO → LHR', 'SFO → SIN Non-Stop', 'EWR → LHR'],
    specialty: 'Polaris Lounge dining, longest nonstop transpacific corridors in Star Alliance',
  },
  {
    id: 'dl',
    name: 'Delta Air Lines',
    iata: 'DL',
    country: 'United States',
    flag: '🇺🇸',
    region: 'Americas',
    alliance: 'SkyTeam',
    hubAirport: 'ATL / JFK / LAX',
    flagshipAircraft: 'Airbus A350-900 / A330-900neo',
    primaryCorridors: ['LAX → SYD Non-Stop', 'JFK → LHR', 'ATL → CDG', 'LAX → HND'],
    specialty: 'Delta One suites with sliding doors, industry-leading US on-time performance',
  },
  {
    id: 'aa',
    name: 'American Airlines',
    iata: 'AA',
    country: 'United States',
    flag: '🇺🇸',
    region: 'Americas',
    alliance: 'Oneworld',
    hubAirport: 'DFW / MIA / JFK',
    flagshipAircraft: 'Boeing 777-300ER / Boeing 787-9',
    primaryCorridors: ['LAX → SYD', 'DFW → LHR', 'JFK → LHR', 'MIA → GRU'],
    specialty: 'Flagship First Dining, deep Oneworld joint venture with British Airways & Qantas',
  },
  {
    id: 'kl',
    name: 'KLM Royal Dutch Airlines',
    iata: 'KL',
    country: 'Netherlands',
    flag: '🇳🇱',
    region: 'Europe',
    alliance: 'SkyTeam',
    hubAirport: 'AMS (Amsterdam Schiphol)',
    flagshipAircraft: 'Boeing 787-10 / Boeing 777-300ER',
    primaryCorridors: ['AMS → SIN', 'AMS → JFK', 'AMS → BKK', 'AMS → CPT'],
    specialty: 'World Business Class Delft Blue Houses, single-terminal seamless transfer',
  },
  {
    id: 'lx',
    name: 'Swiss International Air Lines',
    iata: 'LX',
    country: 'Switzerland',
    flag: '🇨🇭',
    region: 'Europe',
    alliance: 'Star Alliance',
    hubAirport: 'ZRH (Zurich Airport)',
    flagshipAircraft: 'Boeing 777-300ER / Airbus A340-300',
    primaryCorridors: ['ZRH → SIN', 'ZRH → JFK', 'ZRH → NRT', 'ZRH → HKG'],
    specialty: 'SWISS First Zurich private terminal check-in, Swiss precision connection handling',
  },
  {
    id: 'nz',
    name: 'Air New Zealand',
    iata: 'NZ',
    country: 'New Zealand',
    flag: '🇳🇿',
    region: 'Asia-Pacific',
    alliance: 'Star Alliance',
    hubAirport: 'AKL (Auckland Airport)',
    flagshipAircraft: 'Boeing 787-9 Dreamliner',
    primaryCorridors: ['AKL → SYD', 'AKL → JFK (Ultra-Long-Haul)', 'AKL → SIN', 'AKL → LAX'],
    specialty: 'Skynest sleeping pods, Pacific Rim connectivity, Star Alliance partner',
  },
  {
    id: 'ke',
    name: 'Korean Air',
    iata: 'KE',
    country: 'South Korea',
    flag: '🇰🇷',
    region: 'Asia-Pacific',
    alliance: 'SkyTeam',
    hubAirport: 'ICN (Seoul Incheon T2)',
    flagshipAircraft: 'Boeing 787-9 / Airbus A380-800',
    primaryCorridors: ['ICN → LHR', 'ICN → SYD', 'ICN → LAX', 'ICN → CDG'],
    specialty: 'Apex Suite direct aisle access, Incheon Terminal 2 automated transit hub',
  },
  {
    id: 'tk',
    name: 'Turkish Airlines',
    iata: 'TK',
    country: 'Turkey',
    flag: '🇹🇷',
    region: 'Europe',
    alliance: 'Star Alliance',
    hubAirport: 'IST (Istanbul Airport)',
    flagshipAircraft: 'Airbus A350-900 / Boeing 787-9',
    primaryCorridors: ['IST → SYD (via SIN)', 'IST → LHR', 'IST → JFK', 'IST → NRT'],
    specialty: 'Flying Chef onboard dining, flies to more countries than any other airline',
  },
  {
    id: 'ai',
    name: 'Air India',
    iata: 'AI',
    country: 'India',
    flag: '🇮🇳',
    region: 'Asia-Pacific',
    alliance: 'Star Alliance',
    hubAirport: 'DEL (Delhi) / BOM (Mumbai)',
    flagshipAircraft: 'Airbus A350-900 / Boeing 787-8',
    primaryCorridors: ['DEL → LHR Non-Stop', 'DEL → SYD Non-Stop', 'DEL → SFO', 'BOM → LHR'],
    specialty: 'New generation A350 suites, direct non-stop corridors to North America & UK',
  },
  {
    id: 'tg',
    name: 'Thai Airways',
    iata: 'TG',
    country: 'Thailand',
    flag: '🇹🇭',
    region: 'Asia-Pacific',
    alliance: 'Star Alliance',
    hubAirport: 'BKK (Bangkok Suvarnabhumi)',
    flagshipAircraft: 'Airbus A350-900 / Boeing 777-300ER',
    primaryCorridors: ['BKK → LHR', 'BKK → SYD', 'BKK → FRA', 'BKK → NRT'],
    specialty: 'Royal First Spa lounge, key Southeast Asian hub connection routing',
  },
  {
    id: 'ac',
    name: 'Air Canada',
    iata: 'AC',
    country: 'Canada',
    flag: '🇨🇦',
    region: 'Americas',
    alliance: 'Star Alliance',
    hubAirport: 'YYZ (Toronto) / YVR (Vancouver)',
    flagshipAircraft: 'Boeing 787-9 / Boeing 777-300ER',
    primaryCorridors: ['YVR → SYD Non-Stop', 'YYZ → LHR', 'YVR → HND', 'YYZ → FRA'],
    specialty: 'Signature Suite private dining, polar route optimization, Star Alliance',
  },
  {
    id: 'sv',
    name: 'Saudia',
    iata: 'SV',
    country: 'Saudi Arabia',
    flag: '🇸🇦',
    region: 'Middle East',
    alliance: 'SkyTeam',
    hubAirport: 'JED (Jeddah) / RUH (Riyadh)',
    flagshipAircraft: 'Boeing 787-9 / Boeing 777-300ER',
    primaryCorridors: ['RUH → LHR', 'JED → SIN', 'RUH → JFK', 'JED → CDG'],
    specialty: 'Alfursan First suites, rapidly expanding Middle Eastern transcontinental hub',
  },
  {
    id: 'vs',
    name: 'Virgin Atlantic',
    iata: 'VS',
    country: 'United Kingdom',
    flag: '🇬🇧',
    region: 'Europe',
    alliance: 'SkyTeam',
    hubAirport: 'LHR (London Heathrow T3)',
    flagshipAircraft: 'Airbus A350-1000 / A330-900neo',
    primaryCorridors: ['LHR → JFK', 'LHR → LAX', 'LHR → DEL', 'LHR → JNB'],
    specialty: 'The Clubhouse at Heathrow, Upper Class Retreat Suite, SkyTeam partner',
  },
];

interface AppIntroProps {
  onComplete: () => void;
  tripState: TripState;
  onSelectHub?: (hub: HubCode) => void;
  onForceDisruption?: (event: DisruptionEvent | null) => void;
}

export function AppIntro({ 
  onComplete, 
  tripState, 
  onSelectHub, 
  onForceDisruption 
}: AppIntroProps) {
  const { t } = useLanguage();
  const [progress, setProgress] = useState(0); // 0 to 1
  const [currentStage, setCurrentStage] = useState<'takeoff' | 'cruise' | 'descent' | 'arrived'>('takeoff');
  const [planePos, setPlanePos] = useState({ x: 80, y: 260, angle: -25 });
  const [isDone, setIsDone] = useState(false);
  const [animKey, setAnimKey] = useState(0); // to restart animation on flight change
  const [showAirlinesModal, setShowAirlinesModal] = useState(false);
  const [airlineSearch, setAirlineSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL');
  const [selectedAlliance, setSelectedAlliance] = useState<string>('ALL');
  const pathRef = useRef<SVGPathElement | null>(null);

  const activeItinerary = tripState.activeItinerary;
  const activeHub = tripState.activeHub;
  const isDisrupted = !!tripState.disruption;

  // Filter airlines & all country flights
  const filteredAirlines = useMemo(() => {
    return AIRLINES_AND_COUNTRY_FLIGHTS.filter((airline) => {
      const q = airlineSearch.toLowerCase().trim();
      const matchesSearch = !q ||
        airline.name.toLowerCase().includes(q) ||
        airline.iata.toLowerCase().includes(q) ||
        airline.country.toLowerCase().includes(q) ||
        airline.hubAirport.toLowerCase().includes(q) ||
        airline.primaryCorridors.some(c => c.toLowerCase().includes(q));
      
      const matchesRegion = selectedRegion === 'ALL' || airline.region === selectedRegion;
      const matchesAlliance = selectedAlliance === 'ALL' || airline.alliance === selectedAlliance;

      return matchesSearch && matchesRegion && matchesAlliance;
    });
  }, [airlineSearch, selectedRegion, selectedAlliance]);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showAirlinesModal) {
        setShowAirlinesModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showAirlinesModal]);

  // Waypoint definitions based on current active corridor
  const routeWaypoints: Record<HubCode, { x: number; y: number; ctrlX: number; ctrlY: number; label: string; city: string }> = {
    SIN: { x: 440, y: 110, ctrlX: 250, ctrlY: 75, label: 'SIN', city: 'Singapore Changi' },
    DXB: { x: 380, y: 135, ctrlX: 225, ctrlY: 90, label: 'DXB', city: 'Dubai Intl' },
    DOH: { x: 340, y: 125, ctrlX: 205, ctrlY: 85, label: 'DOH', city: 'Hamad Intl (Doha)' },
  };

  const currentHubPoint = routeWaypoints[activeHub] || routeWaypoints.SIN;
  const originPoint = { x: 80, y: 260, code: activeItinerary.leg1.origin, name: activeItinerary.leg1.originName };
  const destPoint = { x: 720, y: 260, code: activeItinerary.leg2.destination, name: activeItinerary.leg2.destinationName };

  // Dynamic SVG quadratic curve through the specific hub coordinates
  const svgPathD = `M ${originPoint.x},${originPoint.y} Q ${currentHubPoint.ctrlX},${currentHubPoint.ctrlY} ${currentHubPoint.x},${currentHubPoint.y} T ${destPoint.x},${destPoint.y}`;

  // Animate the plane along the dynamic flight arc
  useEffect(() => {
    let animationFrameId: number;
    const duration = 3800; // 3.8s smooth glide
    const startTime = performance.now();
    setIsDone(false);
    setProgress(0);

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const tProgress = Math.min(1, elapsed / duration);
      // Smooth sinusoidal ease-in-out
      const easedT = tProgress < 0.5 ? 2 * tProgress * tProgress : -1 + (4 - 2 * tProgress) * tProgress;
      setProgress(easedT);

      if (pathRef.current) {
        const pathLength = pathRef.current.getTotalLength();
        const currentLength = easedT * pathLength;
        const pt = pathRef.current.getPointAtLength(currentLength);
        
        // Calculate tangent angle for realistic aircraft heading
        const lookAheadLength = Math.min(pathLength, currentLength + 2);
        const ptNext = pathRef.current.getPointAtLength(lookAheadLength);
        const dx = ptNext.x - pt.x;
        const dy = ptNext.y - pt.y;
        const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

        setPlanePos({ x: pt.x, y: pt.y, angle });
      }

      // Update flight stages
      if (tProgress < 0.22) {
        setCurrentStage('takeoff');
      } else if (tProgress < 0.78) {
        setCurrentStage('cruise');
      } else if (tProgress < 0.98) {
        setCurrentStage('descent');
      } else {
        setCurrentStage('arrived');
        setIsDone(true);
      }

      if (tProgress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [animKey, activeHub, isDisrupted]);

  const handleSwitchFlight = (hub: HubCode) => {
    if (onSelectHub) {
      onSelectHub(hub);
      setAnimKey((prev) => prev + 1);
    }
  };

  const handleToggleDisruption = () => {
    if (onForceDisruption) {
      if (isDisrupted) {
        onForceDisruption(null);
      } else {
        onForceDisruption(DISRUPTION_PRESETS[0]);
      }
      setAnimKey((prev) => prev + 1);
    }
  };

  const handleReplayAnimation = () => {
    setAnimKey((prev) => prev + 1);
  };

  // Dynamic telemetry calculations based on chosen corridor & disruption
  const delay = tripState.disruption ? tripState.disruption.delayMinutes : 0;
  const curfewMargin = tripState.decision.curfewMarginMinutes;
  const altitude = Math.floor(progress < 0.8 ? progress * 38000 : 38000 - (progress - 0.8) * 35000);
  const groundSpeed = Math.floor(progress < 0.2 ? 180 + progress * 1700 : 515);

  return (
    <div 
      id="voya-flight-intro"
      className="fixed inset-0 z-50 flex flex-col items-center justify-between p-4 sm:p-8 bg-[#F7F4EC] text-[#1E2022] overflow-hidden select-none animate-in fade-in duration-300"
    >
      {/* Subtle Sky Atmosphere & Radar Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#1E2022_1px,transparent_1px)] [background-size:28px_28px]" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#C2410C]/6 rounded-full blur-3xl pointer-events-none" />

      {/* Floating minimalist cloud layers */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-35">
        <div 
          className="absolute top-24 -left-40 w-72 h-16 bg-white/70 rounded-full blur-md transition-transform duration-1000"
          style={{ transform: `translateX(${progress * 80}px)` }}
        />
        <div 
          className="absolute top-64 -right-32 w-96 h-20 bg-white/60 rounded-full blur-lg transition-transform duration-1000"
          style={{ transform: `translateX(${-progress * 90}px)` }}
        />
      </div>

      {/* Top Header Bar */}
      <div className="relative z-10 w-full max-w-5xl flex items-center justify-between border-b border-[#E0D9CB] pb-3 sm:pb-4 gap-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#1E2022] text-white flex items-center justify-center shadow-md">
            <Plane className="w-5 h-5 -rotate-45 text-[#FB923C]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-black text-xl tracking-tight text-[#1E2022]">VOYA</span>
              <span className="text-[10px] font-mono font-bold bg-[#EFEBE1] text-[#C2410C] px-2 py-0.5 rounded border border-[#DDD6C8]">
                {t.dynamicFlightIntro}
              </span>
            </div>
            <div className="text-[11px] font-mono text-[#737A84] hidden sm:block">
              {t.corridorVia}: {activeItinerary.carrier} ({activeItinerary.leg1.flightNumber} / {activeItinerary.leg2.flightNumber})
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Possible Airlines & Country Flights Button */}
          <button
            id="intro-airlines-modal-btn"
            onClick={() => setShowAirlinesModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-[#FAF8F3] border border-[#DDD6C8] hover:border-[#C2410C] text-xs font-mono font-bold text-[#5A606A] hover:text-[#C2410C] shadow-2xs transition-all active:scale-95 group"
            title="Explore Possible Airlines & All Country Flights"
          >
            <Globe className="w-3.5 h-3.5 text-[#C2410C] group-hover:rotate-45 transition-transform" />
            <span className="hidden sm:inline">Airlines & Country Flights</span>
            <span className="sm:hidden">Airlines</span>
            <span className="text-[10px] bg-[#C2410C]/10 text-[#C2410C] font-bold px-1.5 py-0.2 rounded-full">
              24
            </span>
          </button>

          {/* Replay Flight Button */}
          <button
            id="intro-replay-btn"
            onClick={handleReplayAnimation}
            title={t.replay}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-[#FAF8F3] border border-[#DDD6C8] text-xs font-mono text-[#5A606A] hover:text-[#1E2022] shadow-2xs transition-all active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.replay}</span>
          </button>

          {/* Skip Button */}
          <button
            id="intro-skip-button"
            onClick={onComplete}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-[#FAF8F3] border border-[#DDD6C8] hover:border-[#C2410C] text-xs font-mono font-bold text-[#5A606A] hover:text-[#C2410C] shadow-2xs transition-all active:scale-95"
          >
            <span>{t.skip}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Center Flight Animation Stage */}
      <div className="relative z-10 w-full max-w-4xl my-auto flex flex-col items-center">
        {/* Active Stage & Disruption Status Pill */}
        <div className="text-center mb-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E0D9CB] shadow-2xs text-xs font-mono font-bold mb-2">
            <span className={`w-2 h-2 rounded-full ${isDisrupted ? 'bg-amber-500 animate-ping' : 'bg-[#C2410C] animate-ping'}`} />
            <span className={`tracking-wider uppercase ${isDisrupted ? 'text-amber-700' : 'text-[#C2410C]'}`}>
              {isDisrupted && (
                <>⚠️ {t.disruptionStage} ({tripState.execution.selectedRoute || 'DOH'} +{delay}m)</>
              )}
              {!isDisrupted && currentStage === 'takeoff' && t.takeoffStage}
              {!isDisrupted && currentStage === 'cruise' && `${t.cruiseStage} (${activeItinerary.city})`}
              {!isDisrupted && currentStage === 'descent' && t.descentStage}
              {!isDisrupted && currentStage === 'arrived' && t.arrivalStage}
            </span>
          </div>

          {/* Dynamic Flight Corridor Title */}
          <h1 className="text-2xl sm:text-4xl font-display font-bold text-[#1E2022]">
            {originPoint.code} <span className="text-[#C2410C] mx-1">→</span> {activeHub} <span className="text-[#C2410C] mx-1">→</span> {destPoint.code}
          </h1>
          <p className="text-xs sm:text-sm font-mono text-[#6A717B] mt-1">
            {activeItinerary.carrier} • {t.flight1} {activeItinerary.leg1.flightNumber} / {t.flight2} {activeItinerary.leg2.flightNumber} • Total {activeItinerary.totalFlightTime}
          </p>
        </div>

        {/* Interactive Flight & Status Switcher Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-3 z-20">
          <div className="flex items-center bg-white p-1 rounded-xl border border-[#DDD6C8] shadow-2xs text-xs font-mono">
            <span className="text-[10px] text-[#8C929A] px-2 font-bold uppercase hidden sm:inline">{t.selectFlight}</span>
            {(['SIN', 'DXB', 'DOH'] as HubCode[]).map((hub) => {
              const option = HUB_OPTIONS[hub];
              const isSelected = activeHub === hub;
              return (
                <button
                  key={hub}
                  id={`intro-select-flight-${hub}`}
                  onClick={() => handleSwitchFlight(hub)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#C2410C] text-white shadow-xs scale-102'
                      : 'text-[#5A606A] hover:text-[#1E2022] hover:bg-[#FAF8F3]'
                  }`}
                >
                  <span>{hub}</span>
                  <span className={`text-[10px] font-normal ${isSelected ? 'text-white/80' : 'text-[#8C929A]'}`}>
                    ({option.leg1.flightNumber})
                  </span>
                </button>
              );
            })}
          </div>

          {/* Possible Airlines & Country Flights Pill */}
          <button
            id="intro-pills-all-airlines-btn"
            onClick={() => setShowAirlinesModal(true)}
            className="px-3 py-1.5 rounded-xl border border-[#DDD6C8] hover:border-[#C2410C] bg-white hover:bg-[#FAF8F3] text-xs font-mono font-bold text-[#1E2022] hover:text-[#C2410C] transition-all flex items-center gap-1.5 shadow-2xs active:scale-95"
            title="Explore 24+ Global Airlines & All Country Flights"
          >
            <Globe className="w-3.5 h-3.5 text-[#C2410C]" />
            <span>Possible Airlines & Country Flights (24+)</span>
          </button>

          {/* Toggle Disruption Simulation */}
          {onForceDisruption && (
            <button
              id="intro-toggle-disruption-btn"
              onClick={handleToggleDisruption}
              className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all flex items-center gap-1.5 shadow-2xs active:scale-95 ${
                isDisrupted
                  ? 'bg-amber-50 border-amber-300 text-amber-800'
                  : 'bg-white border-[#DDD6C8] text-[#5A606A] hover:border-[#C2410C] hover:text-[#C2410C]'
              }`}
            >
              <AlertTriangle className={`w-3.5 h-3.5 ${isDisrupted ? 'text-amber-600' : 'text-[#8C929A]'}`} />
              <span>{isDisrupted ? t.clearDelay : t.simulateDelay}</span>
            </button>
          )}
        </div>

        {/* SVG Flight Trajectory Canvas */}
        <div className="relative w-full aspect-[2.4/1] max-h-[290px] my-1">
          <svg 
            viewBox="0 0 800 340" 
            className="w-full h-full overflow-visible"
          >
            <defs>
              {/* Contrail Gradient */}
              <linearGradient id="contrailGradDynamic" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#C2410C" stopOpacity="0.1" />
                <stop offset="70%" stopColor="#C2410C" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#EA580C" stopOpacity="1" />
              </linearGradient>

              {/* Waypoint Glow Filter */}
              <filter id="hubGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#C2410C" floodOpacity="0.35" />
              </filter>
            </defs>

            {/* Base Flight Corridor Route Arc */}
            <path
              ref={pathRef}
              d={svgPathD}
              fill="none"
              stroke="#E0D9CB"
              strokeWidth="3"
              strokeDasharray="6,6"
            />

            {/* Glowing Active Flight Contrail following the plane */}
            <path
              d={svgPathD}
              fill="none"
              stroke="url(#contrailGradDynamic)"
              strokeWidth="4"
              strokeLinecap="round"
              pathLength="1000"
              strokeDasharray="1000"
              strokeDashoffset={1000 - progress * 1000}
              className="transition-all duration-75 ease-linear"
            />

            {/* Waypoint 1: Origin (LHR) */}
            <g transform={`translate(${originPoint.x}, ${originPoint.y})`}>
              <circle r="7" fill={progress >= 0 ? '#C2410C' : '#E0D9CB'} filter="url(#hubGlow)" />
              <circle r="14" fill="none" stroke="#C2410C" strokeWidth="1.5" className="animate-ping opacity-40" />
              <text y="24" textAnchor="middle" className="font-mono text-[11px] font-bold fill-[#1E2022]">{originPoint.code}</text>
              <text y="36" textAnchor="middle" className="font-mono text-[9px] fill-[#737A84]">London T2/T3</text>
            </g>

            {/* Waypoint 2: Dynamic Selected Hub (SIN / DXB / DOH) */}
            <g transform={`translate(${currentHubPoint.x}, ${currentHubPoint.y})`}>
              <circle 
                r="8" 
                fill={progress >= 0.5 ? '#C2410C' : '#FAF8F3'} 
                stroke={isDisrupted ? '#D97706' : '#C2410C'} 
                strokeWidth="2.5" 
                filter="url(#hubGlow)" 
              />
              {progress >= 0.45 && (
                <circle r="14" fill="none" stroke="#C2410C" strokeWidth="1.5" className="animate-ping opacity-40" />
              )}
              <text y="-14" textAnchor="middle" className="font-mono text-[12px] font-bold fill-[#C2410C]">
                {currentHubPoint.label}
              </text>
              <text y="-26" textAnchor="middle" className="font-mono text-[9px] font-semibold fill-[#737A84]">
                {currentHubPoint.city}
              </text>
              {/* Layover buffer badge */}
              <text y="18" textAnchor="middle" className={`font-mono text-[9px] font-bold ${isDisrupted ? 'fill-red-600' : 'fill-emerald-700'}`}>
                {isDisrupted ? `Buffer: ${Math.max(0, activeItinerary.scheduledLayoverMinutes - delay)}m ⚠️` : `Buffer: ${activeItinerary.scheduledLayoverMinutes}m`}
              </text>
            </g>

            {/* Waypoint 3: Destination (SYD) */}
            <g transform={`translate(${destPoint.x}, ${destPoint.y})`}>
              <circle 
                r="7" 
                fill={progress >= 0.95 ? '#10B981' : '#FAF8F3'} 
                stroke={progress >= 0.95 ? '#10B981' : '#E0D9CB'} 
                strokeWidth="2.5" 
              />
              {progress >= 0.9 && (
                <circle r="14" fill="none" stroke="#10B981" strokeWidth="1.5" className="animate-ping opacity-50" />
              )}
              <text y="24" textAnchor="middle" className="font-mono text-[11px] font-bold fill-[#1E2022]">{destPoint.code}</text>
              <text y="36" textAnchor="middle" className="font-mono text-[9px] fill-[#737A84]">Sydney T1</text>
            </g>

            {/* Animated Airplane */}
            <g 
              transform={`translate(${planePos.x}, ${planePos.y}) rotate(${planePos.angle})`}
              className="transition-transform duration-75 ease-out"
            >
              {/* Jet Propulsion Glow */}
              <circle cx="-16" cy="0" r="3.5" fill="#F59E0B" opacity="0.8" className="animate-ping" />
              <circle cx="-22" cy="0" r="2" fill="#EA580C" opacity="0.6" />

              {/* Commercial Jet Silhouette / Badge */}
              <g transform="translate(-14, -14)">
                <rect width="28" height="28" rx="8" fill="#1E2022" className="shadow-lg" />
                <path 
                  d="M14 6 L16 11 L22 13 L22 15 L16 15 L15 20 L18 22 L18 23 L14 22 L10 23 L10 22 L13 20 L12 15 L6 15 L6 13 L12 11 Z" 
                  fill="#FAF8F3" 
                />
              </g>
            </g>
          </svg>
        </div>

        {/* Live Flight Telemetry HUD Badges - Dynamically calculated with translations */}
        <div className="grid grid-cols-4 gap-2 sm:gap-4 w-full max-w-xl mt-2 font-mono text-center">
          <div className="bg-white border border-[#E0D9CB] p-2.5 rounded-xl shadow-2xs">
            <div className="text-[10px] text-[#737A84] uppercase">{t.flight1}</div>
            <div className="text-xs sm:text-sm font-bold text-[#1E2022] mt-0.5 truncate">
              {activeItinerary.leg1.flightNumber}
            </div>
            <div className="text-[9px] text-[#8C929A]">{activeItinerary.leg1.origin} → {activeHub}</div>
          </div>

          <div className="bg-white border border-[#E0D9CB] p-2.5 rounded-xl shadow-2xs">
            <div className="text-[10px] text-[#737A84] uppercase">{t.flight2}</div>
            <div className="text-xs sm:text-sm font-bold text-[#1E2022] mt-0.5 truncate">
              {activeItinerary.leg2.flightNumber}
            </div>
            <div className="text-[9px] text-[#8C929A]">{activeHub} → {activeItinerary.leg2.destination}</div>
          </div>

          <div className="bg-white border border-[#E0D9CB] p-2.5 rounded-xl shadow-2xs">
            <div className="text-[10px] text-[#737A84] uppercase">{t.altitude}</div>
            <div className="text-xs sm:text-sm font-bold text-[#1E2022] mt-0.5">
              {altitude.toLocaleString()} <span className="text-[9px] text-[#737A84]">FT</span>
            </div>
            <div className="text-[9px] text-[#8C929A]">{groundSpeed} KTS</div>
          </div>

          <div className="bg-white border border-[#E0D9CB] p-2.5 rounded-xl shadow-2xs">
            <div className="text-[10px] text-[#737A84] uppercase">{t.curfewSafe}</div>
            <div className={`text-xs sm:text-sm font-bold mt-0.5 ${curfewMargin < 60 ? 'text-red-600' : 'text-emerald-700'}`}>
              +{curfewMargin} <span className="text-[9px]">MIN</span>
            </div>
            <div className="text-[9px] text-[#8C929A]">
              {curfewMargin < 60 ? 'TIGHT' : 'CLEAR'}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Launch Call-to-Action */}
      <div className="relative z-10 w-full max-w-md flex flex-col items-center gap-2 pt-2">
        <button
          id="enter-deck-main-btn"
          onClick={onComplete}
          className={`w-full py-3 px-6 rounded-xl font-mono font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 shadow-md active:scale-95 ${
            isDone 
              ? 'bg-[#C2410C] hover:bg-[#A33408] text-white hover:shadow-lg animate-pulse' 
              : 'bg-[#1E2022] hover:bg-[#2B3037] text-white'
          }`}
        >
          <span>{isDone ? `${t.enterDeck} (${activeHub})` : `${t.launchDeck} (${activeHub})`}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="text-[10px] font-mono text-[#737A84] flex items-center gap-1.5 text-center">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>{t.syncNotice}</span>
        </div>
      </div>

      {/* Possible Airlines & All Country Flights Modal */}
      {showAirlinesModal && (
        <div 
          id="airlines-modal-overlay"
          className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setShowAirlinesModal(false)}
        >
          <div 
            id="airlines-modal-card"
            className="bg-[#FAF8F3] border border-[#DDD6C8] rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-[#DDD6C8] bg-white flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1E2022] text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                  <Globe className="w-5 h-5 text-[#FB923C]" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-lg sm:text-xl font-display font-bold text-[#1E2022]">
                      Possible Airlines & All Country Flights
                    </h2>
                    <span className="text-[10px] font-mono font-bold bg-[#C2410C]/10 text-[#C2410C] px-2 py-0.5 rounded border border-[#C2410C]/20">
                      24 Flag Carriers • 40+ Countries
                    </span>
                  </div>
                  <p className="text-xs text-[#5A606A] mt-1 font-sans">
                    VYRA autonomous travel agent monitors international flight corridors, alliance privileges, and connection buffers across world flag carriers.
                  </p>
                </div>
              </div>

              <button
                id="close-airlines-modal-btn"
                onClick={() => setShowAirlinesModal(false)}
                className="w-8 h-8 rounded-lg bg-[#FAF8F3] hover:bg-[#EFEBE1] border border-[#DDD6C8] flex items-center justify-center text-[#5A606A] hover:text-[#1E2022] transition-colors shrink-0"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="p-3 sm:p-4 bg-[#F5F1E8] border-b border-[#DDD6C8] space-y-3">
              {/* Search input */}
              <div className="relative">
                <Search className="w-4 h-4 text-[#8C929A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={airlineSearch}
                  onChange={(e) => setAirlineSearch(e.target.value)}
                  placeholder="Search by airline, code (SQ, QR, EK, BA, ANA...), country, hub, or corridor route..."
                  className="w-full pl-9 pr-8 py-2 bg-white border border-[#DDD6C8] focus:border-[#C2410C] rounded-xl text-xs font-mono placeholder:text-[#8C929A] outline-none shadow-2xs transition-all"
                  autoFocus
                />
                {airlineSearch && (
                  <button 
                    onClick={() => setAirlineSearch('')} 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8C929A] hover:text-[#1E2022]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Filter Chips: Region & Alliance */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                {/* Region Chips */}
                <div className="flex flex-wrap items-center gap-1">
                  <span className="text-[10px] text-[#737A84] font-bold uppercase mr-1">Region:</span>
                  {(['ALL', 'Asia-Pacific', 'Middle East', 'Europe', 'Americas'] as const).map((reg) => (
                    <button
                      key={reg}
                      onClick={() => setSelectedRegion(reg)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-colors ${
                        selectedRegion === reg
                          ? 'bg-[#1E2022] text-white'
                          : 'bg-white text-[#5A606A] hover:text-[#1E2022] border border-[#DDD6C8]'
                      }`}
                    >
                      {reg === 'ALL' ? 'All Regions' : reg}
                    </button>
                  ))}
                </div>

                {/* Alliance Chips */}
                <div className="flex flex-wrap items-center gap-1">
                  <span className="text-[10px] text-[#737A84] font-bold uppercase mr-1">Alliance:</span>
                  {(['ALL', 'Star Alliance', 'Oneworld', 'SkyTeam', 'Independent'] as const).map((all) => (
                    <button
                      key={all}
                      onClick={() => setSelectedAlliance(all)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-colors ${
                        selectedAlliance === all
                          ? 'bg-[#C2410C] text-white'
                          : 'bg-white text-[#5A606A] hover:text-[#1E2022] border border-[#DDD6C8]'
                      }`}
                    >
                      {all === 'ALL' ? 'All Alliances' : all}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Scrollable Airline & Country Flight Cards */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
              <div className="text-[11px] font-mono text-[#737A84] flex items-center justify-between">
                <span>Showing {filteredAirlines.length} of {AIRLINES_AND_COUNTRY_FLIGHTS.length} global airlines</span>
                <span className="text-[#C2410C] font-semibold">Autonomous corridor re-routing ready</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredAirlines.map((airline) => {
                  const isCurrentDemo = airline.hubCode === activeHub;
                  const isSelectableDemo = !!airline.hubCode;

                  return (
                    <div
                      key={airline.id}
                      className={`p-3.5 sm:p-4 rounded-xl border transition-all flex flex-col justify-between ${
                        isCurrentDemo 
                          ? 'bg-[#FAF2EC] border-[#C2410C] ring-1 ring-[#C2410C]/30 shadow-xs' 
                          : 'bg-white border-[#E0D9CB] hover:border-[#C2410C]/60 hover:shadow-2xs'
                      }`}
                    >
                      <div>
                        {/* Top Airline Header */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xl" title={airline.country}>{airline.flag}</span>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-display font-bold text-sm text-[#1E2022]">{airline.name}</span>
                                <span className="text-[10px] font-mono font-bold bg-[#EFEBE1] text-[#1E2022] px-1.5 py-0.5 rounded">
                                  {airline.iata}
                                </span>
                              </div>
                              <span className="text-[10px] font-mono text-[#737A84]">
                                {airline.country} • {airline.region}
                              </span>
                            </div>
                          </div>

                          <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                            airline.alliance === 'Star Alliance' 
                              ? 'bg-amber-100/70 text-amber-900 border border-amber-300' 
                              : airline.alliance === 'Oneworld'
                                ? 'bg-blue-100/70 text-blue-900 border border-blue-300'
                                : airline.alliance === 'SkyTeam'
                                  ? 'bg-sky-100/70 text-sky-900 border border-sky-300'
                                  : 'bg-stone-100 text-stone-800 border border-stone-300'
                          }`}>
                            {airline.alliance}
                          </span>
                        </div>

                        {/* Aircraft & Hub Details */}
                        <div className="mt-2.5 pt-2 border-t border-[#F0EBE0] space-y-1.5 text-[11px] font-mono">
                          <div className="flex items-center gap-1.5 text-[#5A606A]">
                            <span className="text-[#8C929A]">Hub:</span>
                            <span className="font-semibold text-[#1E2022]">{airline.hubAirport}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[#5A606A]">
                            <span className="text-[#8C929A]">Fleet:</span>
                            <span className="text-[#1E2022]">{airline.flagshipAircraft}</span>
                          </div>
                        </div>

                        {/* Country Flight Corridors */}
                        <div className="mt-2">
                          <div className="text-[9px] font-mono uppercase text-[#8C929A] font-bold mb-1">
                            Primary Country Corridors:
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {airline.primaryCorridors.map((route, i) => (
                              <span 
                                key={i}
                                className="text-[10px] font-mono bg-[#FAF8F3] text-[#5A606A] px-2 py-0.5 rounded border border-[#E0D9CB]"
                              >
                                {route}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Autonomous Agent Advantage */}
                        <p className="mt-2 text-[10px] text-[#737A84] italic bg-[#F7F4EC] p-1.5 rounded border border-[#EBE5D8]">
                          {airline.specialty}
                        </p>
                      </div>

                      {/* Action Button */}
                      <div className="mt-3 pt-2 border-t border-[#F0EBE0] flex items-center justify-between">
                        {isCurrentDemo ? (
                          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#C2410C]">
                            <Check className="w-4 h-4" />
                            <span>Currently Active in Flight Simulator</span>
                          </div>
                        ) : isSelectableDemo ? (
                          <button
                            onClick={() => {
                              if (airline.hubCode) {
                                handleSwitchFlight(airline.hubCode);
                                setShowAirlinesModal(false);
                              }
                            }}
                            className="w-full py-1.5 px-3 rounded-lg bg-[#1E2022] hover:bg-[#C2410C] text-white text-xs font-mono font-bold transition-colors flex items-center justify-center gap-1.5"
                          >
                            <span>Simulate {airline.iata} ({airline.hubCode}) Corridor</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <div className="flex items-center justify-between w-full text-[10px] font-mono text-[#737A84]">
                            <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                              Monitored Corridor
                            </span>
                            <span className="text-[#8C929A]">Auto-Reroute Protected</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredAirlines.length === 0 && (
                <div className="text-center py-10">
                  <Globe className="w-8 h-8 text-[#8C929A] mx-auto mb-2 opacity-50" />
                  <p className="text-xs font-mono font-bold text-[#1E2022]">No matching airlines or country flights found</p>
                  <p className="text-[11px] text-[#737A84] mt-1">Try searching for a different carrier, country name, or clearing filters.</p>
                  <button
                    onClick={() => { setAirlineSearch(''); setSelectedRegion('ALL'); setSelectedAlliance('ALL'); }}
                    className="mt-3 px-3 py-1.5 bg-white border border-[#DDD6C8] rounded-lg text-xs font-mono text-[#C2410C] font-bold"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 sm:p-4 bg-white border-t border-[#DDD6C8] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-2 text-[#737A84]">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="text-[11px]">
                  All carriers synchronized with Curfew Rules, MCT Standards & Live Airspace Data
                </span>
              </div>
              <button
                onClick={() => setShowAirlinesModal(false)}
                className="px-4 py-1.5 bg-[#1E2022] hover:bg-[#2B3037] text-white rounded-lg font-bold text-xs transition-colors"
              >
                Back to Flight Simulator
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
