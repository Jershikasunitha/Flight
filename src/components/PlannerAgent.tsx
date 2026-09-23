import { 
  Plane, 
  Clock, 
  MapPin, 
  Luggage, 
  ShieldCheck, 
  Sparkles, 
  UserCheck, 
  ArrowRight,
  Info,
  Globe
} from 'lucide-react';
import { HubOption, HubCode, TravelerProfile, WorldwideLocation } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { WorldwideJourneyInput } from './WorldwideJourneyInput';

interface PlannerAgentProps {
  activeHub: HubCode;
  onSelectHub: (hub: HubCode) => void;
  traveler: TravelerProfile;
  originLocation: WorldwideLocation;
  destinationLocation: WorldwideLocation;
  onChangeOrigin: (loc: WorldwideLocation) => void;
  onChangeDestination: (loc: WorldwideLocation) => void;
  worldwideItineraries: Record<HubCode, HubOption>;
}

export function PlannerAgent({
  activeHub,
  onSelectHub,
  traveler,
  originLocation,
  destinationLocation,
  onChangeOrigin,
  onChangeDestination,
  worldwideItineraries,
}: PlannerAgentProps) {
  const { t, isRTL } = useLanguage();
  const currentItinerary = worldwideItineraries[activeHub];

  const hubList = [
    {
      code: 'SIN' as HubCode,
      title: 'Singapore Route',
      airline: 'Singapore Airlines',
      badge: 'Fastest Elapsed Time',
      duration: worldwideItineraries.SIN.totalFlightTime,
      aircraft: 'A350-900 / A380-800',
      layover: `${worldwideItineraries.SIN.scheduledLayoverMinutes} min at Changi (SIN)`,
      desc: 'Double-daily direct link with ultra-efficient Terminal 3 transfer and SilverKris suites.',
    },
    {
      code: 'DXB' as HubCode,
      title: 'Dubai Route',
      airline: 'Emirates',
      badge: 'Signature First Suite',
      duration: worldwideItineraries.DXB.totalFlightTime,
      aircraft: 'A380-800 / B777-300ER',
      layover: `${worldwideItineraries.DXB.scheduledLayoverMinutes} min at Dubai (DXB)`,
      desc: 'Exclusive Concourse A lounge boarding with shower spa and Porsche chauffeur-drive.',
    },
    {
      code: 'DOH' as HubCode,
      title: 'Doha Route',
      airline: 'Qatar Airways',
      badge: 'Oneworld Emerald Reciprocity',
      duration: worldwideItineraries.DOH.totalFlightTime,
      aircraft: 'B787-9 / A350-1000',
      layover: `${worldwideItineraries.DOH.scheduledLayoverMinutes} min at Hamad (DOH)`,
      desc: 'World-renowned Qsuite with sliding privacy doors and Al Safwa First Lounge access.',
    },
  ];

  return (
    <div id="planner-agent-view" className="space-y-6">
      {/* Worldwide Journey Configurator */}
      <WorldwideJourneyInput
        origin={originLocation}
        destination={destinationLocation}
        onChangeOrigin={onChangeOrigin}
        onChangeDestination={onChangeDestination}
      />

      {/* Agent Banner */}
      <div className="bg-[#FAF8F5] border border-[#E6E1D8] rounded-xl p-5 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C2410C]"></span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#C2410C]">
                {t.agent1Title}
              </span>
            </div>
            <h2 className="text-xl font-display font-bold text-[#1E2022] mt-1">
              {t.strategicCorridor}
            </h2>
            <p className="text-xs text-[#5A606A] mt-0.5">
              {t.agent1Desc} • {originLocation.name} ({originLocation.code || originLocation.city}) → {destinationLocation.name} ({destinationLocation.code || destinationLocation.city}).
            </p>
          </div>
          <div className="flex items-center gap-2 bg-[#EFECE6] px-3 py-1.5 rounded-lg border border-[#DDD7CD] text-xs font-mono">
            <UserCheck className="w-4 h-4 text-[#C2410C]" />
            <span>Policy: <strong>{traveler.loyaltyTier}</strong></span>
          </div>
        </div>
      </div>

      {/* Hub Option Cards */}
      <div>
        <div className="text-xs font-mono uppercase tracking-wider text-[#737A84] font-semibold mb-3 flex items-center justify-between">
          <span>2. Select Global Transit Hub</span>
          <span className="text-[#C2410C] font-bold">Active Hub: {activeHub}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {hubList.map((item) => {
            const isSelected = activeHub === item.code;
            return (
              <div
                key={item.code}
                id={`hub-card-${item.code}`}
                onClick={() => onSelectHub(item.code)}
                className={`cursor-pointer rounded-xl p-4 border transition-all text-left relative ${
                  isSelected
                    ? 'bg-white border-[#C2410C] shadow-md ring-2 ring-[#C2410C]/20'
                    : 'bg-[#FAF8F5] border-[#E6E1D8] hover:border-[#C2410C]/50 hover:bg-white'
                }`}
              >
                {isSelected && (
                  <span className="absolute top-3 right-3 text-[10px] font-mono font-bold bg-[#C2410C] text-white px-2 py-0.5 rounded">
                    ACTIVE PLAN
                  </span>
                )}
                <div className="flex items-center gap-2 text-xs font-mono text-[#8C929A]">
                  <Plane className="w-3.5 h-3.5 text-[#C2410C]" />
                  <span>{item.airline}</span>
                </div>
                <h3 className="font-display font-bold text-base text-[#1E2022] mt-1">
                  {item.title}
                </h3>
                <span className="inline-block mt-1 text-[10px] font-mono px-2 py-0.5 rounded bg-[#EFECE6] text-[#5A606A] font-semibold">
                  {item.badge}
                </span>

                <div className="mt-3 pt-3 border-t border-[#EFECE6] space-y-1.5 text-xs">
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-[#8C929A]">Total Elapsed:</span>
                    <strong className="text-[#1E2022]">{item.duration}</strong>
                  </div>
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-[#8C929A]">Aircraft Fleet:</span>
                    <span className="text-[#5A606A] text-[11px]">{item.aircraft}</span>
                  </div>
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-[#8C929A]">Transfer Window:</span>
                    <span className="text-[#C2410C] font-semibold">{item.layover}</span>
                  </div>
                </div>

                <p className="mt-3 text-[11px] text-[#5A606A] leading-relaxed line-clamp-2">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Itinerary Leg Breakdown */}
      <div className="bg-white border border-[#E6E1D8] rounded-xl p-5 shadow-2xs">
        <div className="flex items-center justify-between border-b border-[#EFECE6] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-base text-[#1E2022]">
              Configured Itinerary Breakdown (Corridor via {currentItinerary.name})
            </span>
          </div>
          <span className="text-xs font-mono bg-[#EFECE6] px-2.5 py-1 rounded text-[#5A606A]">
            Total Flying Time: <strong>{currentItinerary.totalFlightTime}</strong>
          </span>
        </div>

        <div className="space-y-4">
          {/* Leg 1 */}
          <div className="border border-[#EFECE6] rounded-lg p-4 bg-[#FAF8F5]">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EFECE6] pb-2 mb-3">
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="bg-[#1E2022] text-white px-2 py-0.5 rounded font-bold">LEG 1</span>
                <span className="font-bold text-[#C2410C]">{currentItinerary.leg1.flightNumber}</span>
                <span className="text-[#8C929A]">• {currentItinerary.leg1.airline}</span>
                <span className="text-[#5A606A] text-[11px]">({currentItinerary.leg1.aircraft})</span>
              </div>
              <span className="text-xs font-mono font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                Seat Confirmed: {currentItinerary.leg1.seat}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-[10px] font-mono text-[#8C929A] block uppercase">Origin Departure</span>
                <div className="font-bold text-sm text-[#1E2022] mt-0.5">{currentItinerary.leg1.originName}</div>
                <div className="font-mono text-xs text-[#5A606A] mt-0.5">
                  Gate {currentItinerary.leg1.gate} • Departs <strong className="text-[#1E2022]">{currentItinerary.leg1.departureTimeUTC} UTC</strong>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center text-center px-2 py-1 bg-white rounded border border-[#EFECE6]">
                <span className="text-[10px] font-mono text-[#8C929A]">Non-Stop Sector</span>
                <div className="flex items-center gap-2 my-1 text-[#C2410C]">
                  <div className="h-0.5 w-12 bg-[#DDD7CD]"></div>
                  <Plane className="w-4 h-4" />
                  <div className="h-0.5 w-12 bg-[#DDD7CD]"></div>
                </div>
                <span className="font-mono text-[11px] font-bold text-[#1E2022]">
                  {currentItinerary.leg1.duration}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-mono text-[#8C929A] block uppercase">Transit Hub Arrival</span>
                <div className="font-bold text-sm text-[#1E2022] mt-0.5">{currentItinerary.leg1.destinationName}</div>
                <div className="font-mono text-xs text-[#5A606A] mt-0.5">
                  Arrives <strong className="text-[#1E2022]">{currentItinerary.leg1.arrivalTimeUTC} UTC</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Layover Hub Buffer Pill */}
          <div className="flex items-center justify-between bg-[#F4F1EA] border border-[#DDD7CD] px-4 py-2.5 rounded-lg text-xs">
            <div className="flex items-center gap-2 text-[#5A606A]">
              <Clock className="w-4 h-4 text-[#C2410C]" />
              <span>
                Transit Connection at <strong>{currentItinerary.name}</strong>:
              </span>
              <strong className="text-[#1E2022] font-mono">{currentItinerary.scheduledLayoverMinutes} minutes</strong>
              <span className="text-[11px] text-[#8C929A]">(Min connection time: {currentItinerary.minTransferTimeMinutes}m)</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span className="text-[11px] text-[#5A606A] font-medium hidden sm:inline">
                {currentItinerary.hubPerks}
              </span>
            </div>
          </div>

          {/* Leg 2 */}
          <div className="border border-[#EFECE6] rounded-lg p-4 bg-[#FAF8F5]">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EFECE6] pb-2 mb-3">
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="bg-[#1E2022] text-white px-2 py-0.5 rounded font-bold">LEG 2</span>
                <span className="font-bold text-[#C2410C]">{currentItinerary.leg2.flightNumber}</span>
                <span className="text-[#8C929A]">• {currentItinerary.leg2.airline}</span>
                <span className="text-[#5A606A] text-[11px]">({currentItinerary.leg2.aircraft})</span>
              </div>
              <span className="text-xs font-mono font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                Seat Confirmed: {currentItinerary.leg2.seat}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-[10px] font-mono text-[#8C929A] block uppercase">Hub Departure</span>
                <div className="font-bold text-sm text-[#1E2022] mt-0.5">{currentItinerary.leg2.originName}</div>
                <div className="font-mono text-xs text-[#5A606A] mt-0.5">
                  Gate {currentItinerary.leg2.gate} • Departs <strong className="text-[#1E2022]">{currentItinerary.leg2.departureTimeUTC} UTC</strong>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center text-center px-2 py-1 bg-white rounded border border-[#EFECE6]">
                <span className="text-[10px] font-mono text-[#8C929A]">Trans-Equatorial Leg</span>
                <div className="flex items-center gap-2 my-1 text-[#C2410C]">
                  <div className="h-0.5 w-12 bg-[#DDD7CD]"></div>
                  <Plane className="w-4 h-4" />
                  <div className="h-0.5 w-12 bg-[#DDD7CD]"></div>
                </div>
                <span className="font-mono text-[11px] font-bold text-[#1E2022]">
                  {currentItinerary.leg2.duration}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-mono text-[#8C929A] block uppercase">Final Arrival</span>
                <div className="font-bold text-sm text-[#1E2022] mt-0.5">{currentItinerary.leg2.destinationName}</div>
                <div className="font-mono text-xs text-[#5A606A] mt-0.5">
                  Arrives <strong className="text-[#1E2022]">{currentItinerary.leg2.arrivalTimeUTC} UTC</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
