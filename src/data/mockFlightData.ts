import { 
  HubOption, 
  AirportWeather, 
  DisruptionEvent, 
  TravelerProfile, 
  DecisionAnalysis, 
  ExecutionPlan, 
  TelemetryData, 
  HubCode,
  HistoricalFlightData,
  AgentDecisionLog,
  WorldwideLocation
} from '../types';
import { calculateDistanceNm } from './worldwideLocations';

export const HISTORICAL_FLIGHT_DATA: HistoricalFlightData = {
  corridors: {
    SIN: {
      hub: 'SIN',
      carrier: 'Singapore Airlines (SQ)',
      onTimeArrivalRatePercent: 91.4,
      averageEnrouteDelayMinutes: 11.2,
      historicalMisconnectRatePercent: 1.8,
      cancellationRatePercent: 0.15,
      weatherDisruptionRiskLevel: 'LOW',
      avgCurfewArrivalMarginMinutes: 325,
      terminalTransitEfficiencyRating: 9.8,
      primaryAdvantage: 'Exceptional Star Alliance A350/A380 First Class Suites with massive 5h 25m safety margin before Sydney curfew.',
      primaryVulnerability: 'Monsoon convective storm cells over Bay of Bengal and Malacca airspace during seasonal shifts.',
    },
    DXB: {
      hub: 'DXB',
      carrier: 'Emirates (EK)',
      onTimeArrivalRatePercent: 84.1,
      averageEnrouteDelayMinutes: 28.5,
      historicalMisconnectRatePercent: 4.6,
      cancellationRatePercent: 0.40,
      weatherDisruptionRiskLevel: 'MEDIUM',
      avgCurfewArrivalMarginMinutes: 45,
      terminalTransitEfficiencyRating: 8.6,
      primaryAdvantage: 'High-frequency A380 double-deck service with direct Concourse A lounge boarding.',
      primaryVulnerability: 'Dangerous 45-minute curfew cushion (arrives 22:15 +1). Even minor 45m delays trigger expensive mandatory diversions to Melbourne or Brisbane.',
    },
    DOH: {
      hub: 'DOH',
      carrier: 'Qatar Airways (QR)',
      onTimeArrivalRatePercent: 94.2,
      averageEnrouteDelayMinutes: 8.8,
      historicalMisconnectRatePercent: 1.1,
      cancellationRatePercent: 0.10,
      weatherDisruptionRiskLevel: 'LOW',
      avgCurfewArrivalMarginMinutes: 200,
      terminalTransitEfficiencyRating: 9.6,
      primaryAdvantage: 'Industry-leading on-time performance (94.2%), patented Qsuite solo suites, and Oneworld Emerald reciprocity with 3h 20m curfew safety.',
      primaryVulnerability: 'Slightly shorter layover buffer (120m vs 135m in SIN), though Hamad MCT is only 45m.',
    },
  },
  travelerHistory: {
    totalPastCorridorFlights: 8,
    preferredCarrier: 'Singapore Airlines (KrisFlyer Solitaire) & Qatar Airways (Oneworld Emerald)',
    pastMisconnectIncident: 'June 2024: 1 misconnect in Frankfurt (FRA) when connection buffer compressed below 38m. Never misconnected in Singapore or Doha.',
    successfulConnectionsRate: 98.2,
  },
  terminalTransitAverages: {
    SIN: {
      avgTransitMinutes: 14,
      baggageTransferSuccessRatePercent: 99.4,
      tarmacEscortSpeedMinutes: 7,
    },
    DXB: {
      avgTransitMinutes: 32,
      baggageTransferSuccessRatePercent: 96.8,
      tarmacEscortSpeedMinutes: 14,
    },
    DOH: {
      avgTransitMinutes: 18,
      baggageTransferSuccessRatePercent: 99.1,
      tarmacEscortSpeedMinutes: 8,
    },
  },
};

export function getAgentDecisionLogs(
  activeHub: HubCode,
  disruption: DisruptionEvent | null,
  cycleCount: number,
  origin?: WorldwideLocation,
  destination?: WorldwideLocation
): AgentDecisionLog[] {
  const isDisrupted = !!disruption;
  const delay = disruption ? disruption.delayMinutes : 0;
  const origCode = origin?.code || origin?.city?.slice(0, 3).toUpperCase() || 'LHR';
  const destCode = destination?.code || destination?.city?.slice(0, 3).toUpperCase() || 'SYD';
  const origName = origin?.name || 'London Heathrow';
  const destName = destination?.name || 'Sydney Kingsford Smith';

  return [
    {
      id: 'LOG-PLN-01',
      timestamp: 'T-14h 00m (Route Inception)',
      agentName: 'Planner Agent',
      action: `Selected ${origCode} → ${activeHub} → ${destCode} (${origName} to ${destName})`,
      primaryRationale: activeHub === 'SIN'
        ? `Evaluated candidate corridors against operational criteria (Historical OTP, Destination Arrival Buffer, Cabin Hardware, Minimum Connection Time, Alliance Reciprocity, Baggage Integrity, Weather Outlook). Singapore Airlines scored highest (94/100) due to Elena's KrisFlyer Solitaire status, A350/A380 suites, 91.4% historical OTP, and a robust 325-minute buffer prior to landing in ${destName}.`
        : activeHub === 'DOH'
          ? 'Selected Qatar Airways (QR004/QR908) via Doha based on highest historical OTP (94.2%), Oneworld Emerald reciprocity, Qsuite privacy (Seat 2K confirmed), and comfortable 200-minute curfew cushion.'
          : 'Selected Emirates (EK002/EK414) via Dubai based on A380 first suite availability and direct lounge boarding, despite narrow 45m curfew buffer.',
      evaluatedAlternatives: [
        'Singapore Airlines (SIN) - Score: 94/100 (Historical OTP: 91.4%, Curfew Margin: 325m)',
        'Qatar Airways (DOH) - Score: 92/100 (Historical OTP: 94.2%, Curfew Margin: 200m)',
        'Emirates (DXB) - Score: 71/100 (Historical OTP: 84.1%, Curfew Margin: 45m)',
      ],
      rejectedReason: activeHub === 'SIN'
        ? 'Dubai rejected due to hazardous 45m curfew cushion (arrival 22:15 local). Doha ranked as primary standby contingency.'
        : activeHub === 'DOH'
          ? 'Singapore designated as alternative; Dubai excluded due to curfew hazard.'
          : 'Singapore and Doha were alternative options.',
      confidenceScore: 98,
      keyFactors: {
        curfewProtectionMinutes: activeHub === 'SIN' ? 325 : activeHub === 'DOH' ? 200 : 45,
        onTimePerformance: activeHub === 'SIN' ? '91.4%' : activeHub === 'DOH' ? '94.2%' : '84.1%',
        passengerPreferenceMatch: 'Suite Row 1-4 Window (Confirmed)',
        bufferSafetyMargin: '+90m above MCT',
      },
    },
    {
      id: 'LOG-MON-02',
      timestamp: 'T-06h 15m (Pre-Flight Sweep)',
      agentName: 'Monitor Agent',
      action: 'Completed Telemetry Ingest & METAR Atmosphere Verification',
      primaryRationale: 'Corridor radar polled at 10-second intervals. European and Middle Eastern airspace nominal. Runway conditions at LHR T2/T3 and Singapore Changi operating at normal capacity.',
      evaluatedAlternatives: ['Airway routing via Waypoint OKUDO vs UL412'],
      rejectedReason: 'UL412 selected to optimize jet stream tailwinds (+18 kts ground speed).',
      confidenceScore: 99,
      keyFactors: {
        curfewProtectionMinutes: 325,
        onTimePerformance: '98.5% en-route stability',
        passengerPreferenceMatch: 'Gourmet meal selection confirmed',
        bufferSafetyMargin: 'Nominal 135m',
      },
    },
    {
      id: 'LOG-DEC-03',
      timestamp: isDisrupted ? `T-02h 10m (Cycle #${cycleCount} Disruption Detected)` : `T-01h 30m (Cycle #${cycleCount} Nominal Sweep)`,
      agentName: 'Decision Agent',
      action: isDisrupted
        ? `Triggered Disruption Protocol: ${disruption.title} (+${delay}m)`
        : 'Validated Nominal Corridor Health & Curfew Clearance',
      primaryRationale: isDisrupted
        ? `Severe delay (+${delay}m) compresses connection buffer at ${activeHub} from 135m to ${Math.max(0, 135 - delay)}m, breaching the 45m MCT threshold. Historical flight data proves misconnect probability spikes to 84% under 30m buffer. Decision Tree Step 4 mandates immediate reroute to Qatar Airways via Doha (QR004/QR908) to protect Sydney 23:00 curfew and guarantee Qsuite.`
        : `Nominal flight parameters confirmed across all 4 decision tree stages. Layover buffer of 135 minutes exceeds MCT by 90 minutes. Zero risk to Sydney curfew.`,
      evaluatedAlternatives: isDisrupted
        ? [
            'Maintain SQ305 with Tarmac Porsche Intercept (Rejected: 84% baggage misconnect probability and high misconnect risk)',
            'Auto-Reroute to Doha QR004 / QR908 (Selected: 96% confidence, 200m curfew safety)',
            'Reroute via Dubai EK002 / EK414 (Rejected: 45m curfew buffer violates safety threshold)',
          ]
        : ['Maintain Scheduled Routing via Singapore SQ305/SQ231'],
      rejectedReason: isDisrupted
        ? 'Maintaining Singapore route exposes passenger to overnight stranded status. Dubai route exposes passenger to curfew diversion.'
        : 'No rerouting required under nominal conditions.',
      confidenceScore: isDisrupted ? 96 : 99,
      keyFactors: {
        curfewProtectionMinutes: isDisrupted ? 200 : 325,
        onTimePerformance: isDisrupted ? 'Contingency OTP: 94.2%' : 'Active OTP: 91.4%',
        passengerPreferenceMatch: isDisrupted ? 'Qsuite 2K Solo Suite Confirmed' : 'A350/A380 Suites Confirmed',
        bufferSafetyMargin: isDisrupted ? '120m via Doha' : '135m via Singapore',
      },
    },
    {
      id: 'LOG-EXE-04',
      timestamp: isDisrupted ? 'T-01h 45m (Autonomous Dispatch)' : 'T-00h 45m (Standby Sync)',
      agentName: 'Execution Agent',
      action: isDisrupted
        ? 'Dispatched PNR Reissue, Apple Wallet Push & SMS Notification to Elena Rostova'
        : 'Live Telemetry & Boarding Gate Coordinates Synchronized to Mobile Pass',
      primaryRationale: isDisrupted
        ? 'Pre-reserved Qatar Airways Qsuite on QR004/QR908. Issued £250 Oneworld First Lounge compensation credit. Notified ground concierge at Hamad for VIP escort.'
        : 'Flight operating on schedule. Baggage tagged with RFID VIP priority. VYRA voice concierge standing by with real-time updates.',
      evaluatedAlternatives: ['Standard SMS alert vs Full Autonomous Rescheduling'],
      rejectedReason: 'Full autonomous rebooking selected to guarantee seat inventory before general passenger scramble.',
      confidenceScore: 97,
      keyFactors: {
        curfewProtectionMinutes: isDisrupted ? 200 : 325,
        onTimePerformance: 'Guaranteed arrival ahead of curfew',
        passengerPreferenceMatch: 'Elena VIP Tier 1 honored',
        bufferSafetyMargin: 'Complete peace of mind',
      },
    },
  ];
}

export const TRAVELER_PROFILE: TravelerProfile = {
  name: 'Elena Rostova',
  pnr: 'VY-89241',
  loyaltyTier: 'VIP Tier 1 / Emerald',
  loyaltyProgram: 'Oneworld Emerald & Krisflyer Solitaire',
  preferredSeat: 'Window (Row 1-4 Suite)',
  minTransferPreferenceMinutes: 60,
  contactMobile: '+44 7911 123456',
  specialRequests: 'Short connection escort, express baggage transfer, express immigration',
};

// Hub geographic coordinates and carrier details for worldwide corridor generation
const HUB_META: Record<HubCode, {
  lat: number;
  lng: number;
  name: string;
  city: string;
  country: string;
  carrier: string;
  alliance: string;
  aircraft1: string;
  aircraft2: string;
  perks: string;
  leg1FlightNo: string;
  leg2FlightNo: string;
  scheduledLayoverMinutes: number;
  minTransferTimeMinutes: number;
}> = {
  SIN: {
    lat: 1.3644,
    lng: 103.9915,
    name: 'Singapore Changi Airport',
    city: 'Singapore',
    country: 'Singapore',
    carrier: 'Singapore Airlines',
    alliance: 'Star Alliance',
    aircraft1: 'Airbus A350-900 Ultra Long Range',
    aircraft2: 'Airbus A380-800 Suites',
    perks: 'SilverKris The Private Room • Jewel Butterfly Garden • Terminal 3 Skytrain',
    leg1FlightNo: 'SQ305',
    leg2FlightNo: 'SQ231',
    scheduledLayoverMinutes: 135,
    minTransferTimeMinutes: 45,
  },
  DXB: {
    lat: 25.2532,
    lng: 55.3657,
    name: 'Dubai International Airport',
    city: 'Dubai',
    country: 'United Arab Emirates',
    carrier: 'Emirates',
    alliance: 'Independent / Qantas Partner',
    aircraft1: 'Airbus A380-800',
    aircraft2: 'Boeing 777-300ER',
    perks: 'Emirates Concourse A First Lounge • Direct Boarding from Lounge • Chauffeur-drive',
    leg1FlightNo: 'EK002',
    leg2FlightNo: 'EK414',
    scheduledLayoverMinutes: 150,
    minTransferTimeMinutes: 60,
  },
  DOH: {
    lat: 25.2731,
    lng: 51.6081,
    name: 'Hamad International Airport',
    city: 'Doha',
    country: 'Qatar',
    carrier: 'Qatar Airways',
    alliance: 'Oneworld',
    aircraft1: 'Boeing 787-9 Dreamliner',
    aircraft2: 'Airbus A350-1000 Qsuite',
    perks: 'Al Safwa First Lounge • Orchard Indoor Tropical Garden • Al Maha VIP Meet & Assist',
    leg1FlightNo: 'QR004',
    leg2FlightNo: 'QR908',
    scheduledLayoverMinutes: 120,
    minTransferTimeMinutes: 45,
  },
};

export function buildWorldwideItineraries(
  origin: WorldwideLocation,
  destination: WorldwideLocation
): Record<HubCode, HubOption> {
  const origCode = origin.code || origin.city.slice(0, 3).toUpperCase();
  const destCode = destination.code || destination.city.slice(0, 3).toUpperCase();

  const buildHub = (hub: HubCode): HubOption => {
    const meta = HUB_META[hub];
    const d1 = calculateDistanceNm(origin.coordinates, { lat: meta.lat, lng: meta.lng });
    const d2 = calculateDistanceNm({ lat: meta.lat, lng: meta.lng }, destination.coordinates);

    // Approximate flight time based on 480 kts cruise speed
    const hours1 = Math.max(1.5, Math.round((d1 / 480) * 10) / 10);
    const hours2 = Math.max(1.5, Math.round((d2 / 480) * 10) / 10);
    const totalHours = Math.round((hours1 + hours2) * 10) / 10;

    const dur1 = `${Math.floor(hours1)}h ${Math.round((hours1 % 1) * 60).toString().padStart(2, '0')}m`;
    const dur2 = `${Math.floor(hours2)}h ${Math.round((hours2 % 1) * 60).toString().padStart(2, '0')}m`;
    const totalDurStr = `${Math.floor(totalHours)}h ${Math.round((totalHours % 1) * 60).toString().padStart(2, '0')}m`;

    return {
      code: hub,
      name: meta.name,
      city: meta.city,
      country: meta.country,
      carrier: meta.carrier,
      alliance: meta.alliance,
      scheduledLayoverMinutes: meta.scheduledLayoverMinutes,
      minTransferTimeMinutes: meta.minTransferTimeMinutes,
      totalFlightTime: totalDurStr,
      aircraftTypeLeg1: meta.aircraft1,
      aircraftTypeLeg2: meta.aircraft2,
      hubPerks: meta.perks,
      leg1: {
        flightNumber: meta.leg1FlightNo,
        airline: meta.carrier,
        aircraft: hub === 'SIN' ? 'A350-900' : hub === 'DXB' ? 'A380-800' : 'B787-9',
        origin: origCode,
        originName: `${origin.name}`,
        destination: hub,
        destinationName: meta.name,
        departureTimeUTC: '09:25',
        arrivalTimeUTC: '17:30',
        duration: dur1,
        seat: hub === 'SIN' ? '2A (Business Suite)' : hub === 'DXB' ? '2K (First Class Private Suite)' : '1A (Qsuite)',
        cabin: hub === 'DXB' ? 'First Class' : 'Business Class',
        gate: 'B36',
        terminal: origin.type === 'rail' ? 'Central Station' : origin.type === 'port' ? 'Marine Terminal' : 'T2 / Intl',
        status: 'SCHEDULED',
      },
      leg2: {
        flightNumber: meta.leg2FlightNo,
        airline: meta.carrier,
        aircraft: hub === 'SIN' ? 'A380-800' : hub === 'DXB' ? 'B777-300ER' : 'A350-1000',
        origin: hub,
        originName: meta.name,
        destination: destCode,
        destinationName: `${destination.name}`,
        departureTimeUTC: '19:45',
        arrivalTimeUTC: '08:35 +1',
        duration: dur2,
        seat: hub === 'SIN' ? '3A (First Class Suite)' : hub === 'DXB' ? '4K (Business Class)' : '2K (Qsuite Solo)',
        cabin: hub === 'SIN' ? 'First Class' : 'Business Class',
        gate: 'A12',
        terminal: 'T3',
        status: 'SCHEDULED',
      },
    };
  };

  return {
    SIN: buildHub('SIN'),
    DXB: buildHub('DXB'),
    DOH: buildHub('DOH'),
  };
}

export function buildWorldwideWeather(
  origin: WorldwideLocation,
  hub: HubCode,
  destination: WorldwideLocation
): { origin: AirportWeather; hub: AirportWeather; destination: AirportWeather } {
  const origCode = origin.code || origin.city.slice(0, 3).toUpperCase();
  const destCode = destination.code || destination.city.slice(0, 3).toUpperCase();

  const originWeather: AirportWeather = {
    airportCode: origCode,
    city: origin.city,
    temperatureC: 22,
    wind: '180° at 9 kts',
    visibilityKm: 10,
    condition: 'Clear, Optimal Departure Envelope',
    metar: `${origCode} 221620Z 18009KT 9999 SKC 22/14 Q1015 NOSIG`,
    runwayStatus: origin.type === 'rail' 
      ? 'High-Speed Rail Platform Nominal' 
      : origin.type === 'port' 
        ? 'Dock & Berth Clear for Departure' 
        : 'Active Runway - Normal Ops',
  };

  const hubWeather: AirportWeather = INITIAL_WEATHER[hub] || INITIAL_WEATHER.SIN;

  const destinationWeather: AirportWeather = {
    airportCode: destCode,
    city: destination.city,
    temperatureC: 19,
    wind: '160° at 11 kts',
    visibilityKm: 10,
    condition: 'Optimal Visibility, Clear En-Route Flow',
    metar: `${destCode} 221600Z 16011KT 9999 FEW030 19/12 Q1019 NOSIG`,
    runwayStatus: destination.type === 'rail' 
      ? 'Central Station Arrival Terminal Ready' 
      : destination.type === 'port' 
        ? 'Passenger Ferry Berth Operational' 
        : 'Primary Runway Active - Landing Clearance Ready',
  };

  return {
    origin: originWeather,
    hub: hubWeather,
    destination: destinationWeather,
  };
}

export function buildWorldwideTelemetry(
  origin: WorldwideLocation,
  destination: WorldwideLocation,
  hub: HubCode,
  flightNumber = 'SQ305'
): TelemetryData {
  const meta = HUB_META[hub];
  const d1 = calculateDistanceNm(origin.coordinates, { lat: meta.lat, lng: meta.lng });
  const d2 = calculateDistanceNm({ lat: meta.lat, lng: meta.lng }, destination.coordinates);
  const total = Math.max(500, d1 + d2);
  const covered = Math.round(total * 0.45);
  const remaining = total - covered;

  return {
    flightNumber,
    aircraft: 'Airbus A350-900 / B787-9',
    altitudeFt: 37000,
    groundSpeedKts: 535,
    headingDeg: 108,
    currentWaypoint: `Trans-Continental Airway (${origin.city} → ${hub})`,
    distanceCoveredNm: covered,
    distanceRemainingNm: remaining,
    etaUTC: '17:35 UTC',
  };
}

export const HUB_OPTIONS: Record<HubCode, HubOption> = {
  SIN: {
    code: 'SIN',
    name: 'Singapore Changi Airport',
    city: 'Singapore',
    country: 'Singapore',
    carrier: 'Singapore Airlines',
    alliance: 'Star Alliance',
    scheduledLayoverMinutes: 135,
    minTransferTimeMinutes: 45,
    totalFlightTime: '21h 50m',
    aircraftTypeLeg1: 'Airbus A350-900 Ultra Long Range',
    aircraftTypeLeg2: 'Airbus A380-800 Suites',
    hubPerks: 'SilverKris The Private Room • Jewel Butterfly Garden • Terminal 3 Skytrain',
    leg1: {
      flightNumber: 'SQ305',
      airline: 'Singapore Airlines',
      aircraft: 'A350-900',
      origin: 'LHR',
      originName: 'London Heathrow (T2)',
      destination: 'SIN',
      destinationName: 'Singapore Changi (T3)',
      departureTimeUTC: '09:25',
      arrivalTimeUTC: '05:30 +1',
      duration: '13h 05m',
      seat: '2A (Business Suite)',
      cabin: 'Business Class',
      gate: 'B36',
      terminal: 'T2',
      status: 'SCHEDULED',
    },
    leg2: {
      flightNumber: 'SQ231',
      airline: 'Singapore Airlines',
      aircraft: 'A380-800',
      origin: 'SIN',
      originName: 'Singapore Changi (T3)',
      destination: 'SYD',
      destinationName: 'Sydney Kingsford Smith (T1)',
      departureTimeUTC: '07:45 +1',
      arrivalTimeUTC: '17:35 +1',
      duration: '7h 50m',
      seat: '3A (First Class Suite)',
      cabin: 'First Class',
      gate: 'A12',
      terminal: 'T3',
      status: 'SCHEDULED',
    },
  },
  DXB: {
    code: 'DXB',
    name: 'Dubai International Airport',
    city: 'Dubai',
    country: 'United Arab Emirates',
    carrier: 'Emirates',
    alliance: 'Independent / Qantas Partner',
    scheduledLayoverMinutes: 150,
    minTransferTimeMinutes: 60,
    totalFlightTime: '22h 10m',
    aircraftTypeLeg1: 'Airbus A380-800',
    aircraftTypeLeg2: 'Boeing 777-300ER',
    hubPerks: 'Emirates Concourse A First Lounge • Direct Boarding from Lounge • Chauffeur-drive',
    leg1: {
      flightNumber: 'EK002',
      airline: 'Emirates',
      aircraft: 'A380-800',
      origin: 'LHR',
      originName: 'London Heathrow (T3)',
      destination: 'DXB',
      destinationName: 'Dubai International (T3)',
      departureTimeUTC: '13:35',
      arrivalTimeUTC: '23:45',
      duration: '7h 10m',
      seat: '2K (First Class Private Suite)',
      cabin: 'First Class',
      gate: 'C14',
      terminal: 'T3',
      status: 'SCHEDULED',
    },
    leg2: {
      flightNumber: 'EK414',
      airline: 'Emirates',
      aircraft: 'B777-300ER',
      origin: 'DXB',
      originName: 'Dubai International (T3)',
      destination: 'SYD',
      destinationName: 'Sydney Kingsford Smith (T1)',
      departureTimeUTC: '02:15 +1',
      arrivalTimeUTC: '22:15 +1',
      duration: '14h 00m',
      seat: '4K (Business Class)',
      cabin: 'Business Class',
      gate: 'B22',
      terminal: 'T3',
      status: 'SCHEDULED',
    },
  },
  DOH: {
    code: 'DOH',
    name: 'Hamad International Airport',
    city: 'Doha',
    country: 'Qatar',
    carrier: 'Qatar Airways',
    alliance: 'Oneworld',
    scheduledLayoverMinutes: 120,
    minTransferTimeMinutes: 45,
    totalFlightTime: '21h 35m',
    aircraftTypeLeg1: 'Boeing 787-9 Dreamliner',
    aircraftTypeLeg2: 'Airbus A350-1000 Qsuite',
    hubPerks: 'Al Safwa First Lounge • Orchard Indoor Tropical Garden • Al Maha VIP Meet & Assist',
    leg1: {
      flightNumber: 'QR004',
      airline: 'Qatar Airways',
      aircraft: 'B787-9',
      origin: 'LHR',
      originName: 'London Heathrow (T4)',
      destination: 'DOH',
      destinationName: 'Hamad International',
      departureTimeUTC: '14:55',
      arrivalTimeUTC: '23:50',
      duration: '6h 55m',
      seat: '1A (Qsuite)',
      cabin: 'Business Class (Qsuite)',
      gate: 'A08',
      terminal: 'T4',
      status: 'SCHEDULED',
    },
    leg2: {
      flightNumber: 'QR908',
      airline: 'Qatar Airways',
      aircraft: 'A350-1000',
      origin: 'DOH',
      originName: 'Hamad International',
      destination: 'SYD',
      destinationName: 'Sydney Kingsford Smith (T1)',
      departureTimeUTC: '01:50 +1',
      arrivalTimeUTC: '19:40 +1',
      duration: '13h 50m',
      seat: '2K (Qsuite Solo)',
      cabin: 'Business Class (Qsuite)',
      gate: 'C10',
      terminal: 'Main Concourse',
      status: 'SCHEDULED',
    },
  },
};

export const INITIAL_WEATHER: Record<'LHR' | 'SIN' | 'DXB' | 'DOH' | 'SYD', AirportWeather> = {
  LHR: {
    airportCode: 'LHR',
    city: 'London',
    temperatureC: 14,
    wind: '240° at 12 kts',
    visibilityKm: 10,
    condition: 'Overcast, Light Drizzle',
    metar: 'EGLL 221620Z 24012KT 9999 -RA FEW020 BKN040 14/11 Q1016 NOSIG',
    runwayStatus: 'RWY 27L/27R Active - Normal Ops',
  },
  SIN: {
    airportCode: 'SIN',
    city: 'Singapore',
    temperatureC: 29,
    wind: '080° at 6 kts',
    visibilityKm: 10,
    condition: 'Partly Cloudy, Tropical Warmth',
    metar: 'WSSS 221600Z 08006KT 9999 FEW018TCU SCT030 29/24 Q1008 NOSIG',
    runwayStatus: 'RWY 02L/02C Active - Normal Ops',
  },
  DXB: {
    airportCode: 'DXB',
    city: 'Dubai',
    temperatureC: 34,
    wind: '330° at 14 kts',
    visibilityKm: 8,
    condition: 'Hazy Sun, Light Dust Suspension',
    metar: 'OMDB 221600Z 33014KT 8000 HZ NSC 34/18 Q1009 NOSIG',
    runwayStatus: 'RWY 12L/30R Active - Normal Ops',
  },
  DOH: {
    airportCode: 'DOH',
    city: 'Doha',
    temperatureC: 32,
    wind: '350° at 11 kts',
    visibilityKm: 10,
    condition: 'Clear Sky, Optimal Visibility',
    metar: 'OTHH 221600Z 35011KT 9999 SKC 32/17 Q1011 NOSIG',
    runwayStatus: 'RWY 16L/34R Active - Optimal Ops',
  },
  SYD: {
    airportCode: 'SYD',
    city: 'Sydney',
    temperatureC: 21,
    wind: '170° at 15 kts',
    visibilityKm: 10,
    condition: 'Clear, Fresh Southerly Airflow',
    metar: 'YSSY 221600Z 17015KT 9999 FEW035 21/13 Q1022 NOSIG',
    runwayStatus: 'RWY 34L in use - Curfew enforcement at 23:00 local',
  },
};

export const DISRUPTION_PRESETS: DisruptionEvent[] = [
  {
    id: 'DISRUPT-STORM-SIN',
    title: 'Severe Convective Supercell (Bay of Bengal)',
    type: 'WEATHER',
    severity: 'CRITICAL',
    delayMinutes: 110,
    location: 'Bay of Bengal / Malacca Airspace',
    description: 'En-route avoidance routing adds 110 minutes flight time to SQ305. Connection buffer at Changi drops from 135 min to 25 min (below 45 min MCT). High risk of missed connection SQ231.',
    impactedHub: 'SIN',
  },
  {
    id: 'DISRUPT-ATC-DXB',
    title: 'Dubai Airspace ATC Separation Hold',
    type: 'ATC',
    severity: 'MEDIUM',
    delayMinutes: 45,
    location: 'Gulf Inbound Corridor (OMDB TMA)',
    description: 'Air traffic flow management imposes 45-minute sequencing hold for inbound EK002. Layover buffer tightens to 55 minutes at DXB Terminal 3.',
    impactedHub: 'DXB',
  },
  {
    id: 'DISRUPT-CREW-DOH',
    title: 'Flight Deck Duty Period Rest Timeout',
    type: 'CREW',
    severity: 'MEDIUM',
    delayMinutes: 90,
    location: 'Hamad International Departure Bay',
    description: 'Relief crew swap delayed due to regulatory rest window. QR004 arrives 20 min late but QR908 departure pushed back 70 minutes.',
    impactedHub: 'DOH',
  },
];

export function computeDecisionAnalysis(
  activeHub: HubCode,
  disruption: DisruptionEvent | null,
  origin?: WorldwideLocation,
  destination?: WorldwideLocation
): DecisionAnalysis {
  const itineraries = origin && destination ? buildWorldwideItineraries(origin, destination) : HUB_OPTIONS;
  const currentHubOption = itineraries[activeHub];
  const scheduledBuffer = currentHubOption.scheduledLayoverMinutes;
  const delay = disruption ? disruption.delayMinutes : 0;
  const effectiveBuffer = Math.max(0, scheduledBuffer - delay);
  const minRequired = currentHubOption.minTransferTimeMinutes;

  const destCity = destination?.city || 'Sydney';
  const destCode = destination?.code || destination?.city?.slice(0, 3).toUpperCase() || 'SYD';
  const origCode = origin?.code || origin?.city?.slice(0, 3).toUpperCase() || 'LHR';

  let riskScore = 12;
  let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
  let connectionFailureProbability = 4;
  let curfewMargin = 120;
  let curfewWarning = false;
  let baggageRisk: 'LOW' | 'ELEVATED' | 'CRITICAL' = 'LOW';
  let fatigueIndex = 3;

  if (disruption && disruption.severity !== 'NONE') {
    if (delay >= 90 || effectiveBuffer < minRequired) {
      riskScore = 86;
      riskLevel = 'HIGH';
      connectionFailureProbability = 84;
      curfewMargin = activeHub === 'DXB' ? 15 : 45;
      curfewWarning = activeHub === 'DXB';
      baggageRisk = 'CRITICAL';
      fatigueIndex = 8;
    } else if (delay >= 30) {
      riskScore = 48;
      riskLevel = 'MEDIUM';
      connectionFailureProbability = 38;
      curfewMargin = 65;
      curfewWarning = false;
      baggageRisk = 'ELEVATED';
      fatigueIndex = 5;
    }
  }

  // Decision Tree Steps
  const decisionTree = [
    {
      id: 'DT-1',
      stage: 'Telemetry & Corridor Ingest',
      condition: `Flight radar polling active • Hub: ${activeHub} (${origCode} → ${destCode})`,
      result: disruption ? `ALERT: ${disruption.title} (+${delay}m delay detected)` : 'Corridor nominal. Flight on schedule.',
      status: disruption ? ('WARNING' as const) : ('PASS' as const),
    },
    {
      id: 'DT-2',
      stage: 'Connection Buffer Validation',
      condition: `Minimum Connection Time (MCT) = ${minRequired}m • Current Buffer = ${effectiveBuffer}m`,
      result: effectiveBuffer >= minRequired + 30 
        ? `Buffer healthy (+${effectiveBuffer}m margin)` 
        : effectiveBuffer >= minRequired 
          ? `Buffer compressed (${effectiveBuffer}m). Transfer escort recommended.` 
          : `CRITICAL BREACH: Buffer ${effectiveBuffer}m < MCT ${minRequired}m. Guaranteed misconnect.`,
      status: effectiveBuffer < minRequired ? ('FAIL' as const) : effectiveBuffer < minRequired + 30 ? ('WARNING' as const) : ('PASS' as const),
    },
    {
      id: 'DT-3',
      stage: `${destCity} (${destCode}) Arrival Feasibility & Curfew Check`,
      condition: `${destCode} airport operational arrival slot & airspace clearance envelope`,
      result: curfewWarning 
        ? `High violation hazard: Inbound landing clearance projected late. Divert risk.` 
        : `Clear: Landing scheduled on time (${curfewMargin}m buffer before arrival window restrictions).`,
      status: curfewWarning ? ('FAIL' as const) : ('PASS' as const),
    },
    {
      id: 'DT-4',
      stage: 'Passenger Tier & Policy Resolution',
      condition: 'Elena Rostova: VIP Tier 1 / Oneworld Emerald / Suites Preferred',
      result: riskLevel === 'HIGH' 
        ? 'Execute Auto-Reroute to fastest oneworld hub (Doha QR908) with guaranteed First/Business suite.' 
        : riskLevel === 'MEDIUM' 
          ? 'Maintain routing with VIP Tarmac Porsche Transfer & express bag priority tag.' 
          : 'Maintain scheduled itinerary. No intervention required.',
      status: riskLevel === 'HIGH' ? ('ACTIVE' as const) : ('PASS' as const),
    },
  ];

  // Route Comparisons
  const comparisons: any[] = [
    {
      hub: 'SIN' as HubCode,
      hubName: 'Singapore Changi',
      carrier: 'Singapore Airlines',
      flight1: 'SQ305',
      flight2: 'SQ231',
      totalTime: activeHub === 'SIN' && disruption ? `${itineraries.SIN.totalFlightTime} (+1h 50m)` : itineraries.SIN.totalFlightTime,
      connectionBufferMinutes: activeHub === 'SIN' ? effectiveBuffer : 135,
      sydneyArrivalLocal: activeHub === 'SIN' && disruption ? '19:25 +1' : '17:35 +1',
      curfewMarginMinutes: activeHub === 'SIN' && disruption ? 215 : 325,
      seatAvailability: '3 Suites / 5 Business',
      riskScore: activeHub === 'SIN' ? riskScore : 14,
      feasibility: activeHub === 'SIN' && effectiveBuffer < minRequired ? 'HIGH_RISK' : 'RECOMMENDED',
    },
    {
      hub: 'DOH' as HubCode,
      hubName: 'Hamad International',
      carrier: 'Qatar Airways',
      flight1: 'QR004',
      flight2: 'QR908',
      totalTime: itineraries.DOH.totalFlightTime,
      connectionBufferMinutes: 120,
      sydneyArrivalLocal: '19:40 +1',
      curfewMarginMinutes: 200,
      seatAvailability: '4 Qsuites (Seat 2K open)',
      riskScore: 8,
      feasibility: 'RECOMMENDED',
    },
    {
      hub: 'DXB' as HubCode,
      hubName: 'Dubai International',
      carrier: 'Emirates',
      flight1: 'EK002',
      flight2: 'EK414',
      totalTime: itineraries.DXB.totalFlightTime,
      connectionBufferMinutes: 150,
      sydneyArrivalLocal: '22:15 +1',
      curfewMarginMinutes: 45,
      seatAvailability: '2 First / 8 Business',
      riskScore: 34,
      feasibility: 'FEASIBLE',
    },
  ];

  return {
    riskScore,
    riskLevel,
    connectionFailureProbability,
    curfewWarning,
    curfewMarginMinutes: curfewMargin,
    baggageTransferRisk: baggageRisk,
    passengerFatigueIndex: fatigueIndex,
    decisionTree,
    comparisons,
  };
}

export function computeExecutionPlan(
  activeHub: HubCode,
  decision: DecisionAnalysis,
  disruption: DisruptionEvent | null,
  origin?: WorldwideLocation,
  destination?: WorldwideLocation
): ExecutionPlan {
  const origCode = origin?.code || origin?.city?.slice(0, 3).toUpperCase() || 'LHR';
  const destCode = destination?.code || destination?.city?.slice(0, 3).toUpperCase() || 'SYD';
  const destCity = destination?.city || 'Sydney';
  const itineraries = origin && destination ? buildWorldwideItineraries(origin, destination) : HUB_OPTIONS;

  if (decision.riskLevel === 'HIGH') {
    return {
      actionTitle: `Autonomous Flight Reroute to QR004 / QR908 via Doha (DOH)`,
      actionSummary: `Due to severe disruption (+${disruption?.delayMinutes || 110}m delay), VOYA has pre-reserved Qatar Airways Qsuite on QR004 & QR908 to ${destCity} (${destCode}). Guarantees on-time arrival with 120 min comfortable transfer.`,
      confidenceScore: 96,
      selectedRoute: 'DOH',
      rerouteFlights: {
        leg1: `QR004 (${origCode} 14:55 → DOH 23:50)`,
        leg2: `QR908 (DOH 01:50 → ${destCode} 19:40 +1)`,
        carrier: 'Qatar Airways (Oneworld Alliance)',
      },
      reasoningPoints: [
        `Eliminates 84% probability of missed connection at ${activeHub}.`,
        'Preserves VIP passenger preference for solo window suite (Seat 2K Qsuite confirmed).',
        `Guarantees ${destCity} arrival without curfew violation risk.`,
        'Baggage transfer window is 120 minutes with automated priority tag sync.',
        'Oneworld Emerald tier reciprocity fully honored with Al Safwa First Lounge access.',
      ],
      travelerNotified: false,
      notificationChannels: ['Apple Wallet Pass Push', 'VIP Concierge SMS', 'In-App VYRA Audio'],
      compensationVoucher: {
        code: 'VY-QATAR-EMR-882',
        type: 'Oneworld First Lounge & Dining Credit',
        amount: '£250 voucher + Al Safwa Spa pass',
      },
    };
  }

  if (decision.riskLevel === 'MEDIUM') {
    return {
      actionTitle: `Priority VIP Tarmac Escort & Luggage Intercept at ${activeHub}`,
      actionSummary: `Moderate delay (+${disruption?.delayMinutes || 45}m). Current connection buffer is tight (${decision.comparisons[0]?.connectionBufferMinutes}m), but viable with tarmac Porsche transfer and priority luggage clearance.`,
      confidenceScore: 91,
      selectedRoute: activeHub,
      reasoningPoints: [
        `Direct ramp transfer organized at ${activeHub} to bypass terminal concourse.`,
        'Baggage hold expedited via RFID priority tag system.',
        'Estimated connection transit time reduced from 35m to 12m.',
        'Traveler mobile boarding pass updated with direct gate coordinates.',
      ],
      travelerNotified: false,
      notificationChannels: ['Apple Wallet Push', 'SMS Dispatch'],
    };
  }

  return {
    actionTitle: `Maintain Primary Scheduled Itinerary via ${activeHub}`,
    actionSummary: `Corridor operating with optimal parameters. Connection buffer is comfortable at ${itineraries[activeHub].scheduledLayoverMinutes}m. No rerouting needed.`,
    confidenceScore: 99,
    selectedRoute: activeHub,
    reasoningPoints: [
      `All flight segments on time with zero ATC delays reported.`,
      `Weather across ${origCode}, ${activeHub}, and ${destCode} is clear and within flight envelopes.`,
      `${destCity} arrival on track for ${itineraries[activeHub].leg2.arrivalTimeUTC}, well clear of operational limits.`,
      `VIP lounge access confirmed in Changi/Dubai/Doha.`,
    ],
    travelerNotified: false,
    notificationChannels: ['Status Sync'],
  };
}


export const INITIAL_TELEMETRY: TelemetryData = {
  flightNumber: 'SQ305',
  aircraft: 'Airbus A350-900 (9V-SMD)',
  altitudeFt: 37000,
  groundSpeedKts: 542,
  headingDeg: 112,
  currentWaypoint: 'OKUDO (Bay of Bengal Airway)',
  distanceCoveredNm: 4120,
  distanceRemainingNm: 2540,
  etaUTC: '05:30 +1',
};
