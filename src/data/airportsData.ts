import { HubCode, FlightLeg, AirportWeather, HubOption } from '../types';
import { HUB_OPTIONS } from './mockFlightData';

export interface AirportInfo {
  code: string;
  name: string;
  city: string;
  country: string;
  flag: string;
  x: number; // 1000x600 map coordinate
  y: number;
  terminal: string;
  defaultGate: string;
  timezone: string;
}

export const AIRPORT_REGISTRY: Record<string, AirportInfo> = {
  LHR: {
    code: 'LHR',
    name: 'London Heathrow Airport',
    city: 'London',
    country: 'United Kingdom',
    flag: '🇬🇧',
    x: 220,
    y: 160,
    terminal: 'Terminal 5',
    defaultGate: 'B36',
    timezone: 'UTC+1',
  },
  JFK: {
    code: 'JFK',
    name: 'John F. Kennedy International',
    city: 'New York',
    country: 'United States',
    flag: '🇺🇸',
    x: 130,
    y: 190,
    terminal: 'Terminal 4',
    defaultGate: 'A4',
    timezone: 'UTC-4',
  },
  CDG: {
    code: 'CDG',
    name: 'Paris Charles de Gaulle Airport',
    city: 'Paris',
    country: 'France',
    flag: '🇫🇷',
    x: 240,
    y: 180,
    terminal: 'Terminal 2E',
    defaultGate: 'K41',
    timezone: 'UTC+2',
  },
  FRA: {
    code: 'FRA',
    name: 'Frankfurt am Main Airport',
    city: 'Frankfurt',
    country: 'Germany',
    flag: '🇩🇪',
    x: 270,
    y: 170,
    terminal: 'Terminal 1',
    defaultGate: 'Z15',
    timezone: 'UTC+2',
  },
  SFO: {
    code: 'SFO',
    name: 'San Francisco International',
    city: 'San Francisco',
    country: 'United States',
    flag: '🇺🇸',
    x: 60,
    y: 200,
    terminal: 'International Terminal G',
    defaultGate: 'G98',
    timezone: 'UTC-7',
  },
  HND: {
    code: 'HND',
    name: 'Tokyo Haneda International',
    city: 'Tokyo',
    country: 'Japan',
    flag: '🇯🇵',
    x: 790,
    y: 220,
    terminal: 'Terminal 3',
    defaultGate: '112',
    timezone: 'UTC+9',
  },
  SIN: {
    code: 'SIN',
    name: 'Singapore Changi Airport',
    city: 'Singapore',
    country: 'Singapore',
    flag: '🇸🇬',
    x: 670,
    y: 350,
    terminal: 'Terminal 3',
    defaultGate: 'B7',
    timezone: 'UTC+8',
  },
  DXB: {
    code: 'DXB',
    name: 'Dubai International Airport',
    city: 'Dubai',
    country: 'United Arab Emirates',
    flag: '🇦🇪',
    x: 490,
    y: 260,
    terminal: 'Terminal 3',
    defaultGate: 'B14',
    timezone: 'UTC+4',
  },
  DOH: {
    code: 'DOH',
    name: 'Hamad International Airport',
    city: 'Doha',
    country: 'Qatar',
    flag: '🇶🇦',
    x: 470,
    y: 270,
    terminal: 'Terminal 1',
    defaultGate: 'C2',
    timezone: 'UTC+3',
  },
  SYD: {
    code: 'SYD',
    name: 'Sydney Kingsford Smith Airport',
    city: 'Sydney',
    country: 'Australia',
    flag: '🇦🇺',
    x: 880,
    y: 490,
    terminal: 'Terminal 1',
    defaultGate: 'Gate 32',
    timezone: 'UTC+10',
  },
  AKL: {
    code: 'AKL',
    name: 'Auckland International Airport',
    city: 'Auckland',
    country: 'New Zealand',
    flag: '🇳🇿',
    x: 940,
    y: 520,
    terminal: 'International Terminal',
    defaultGate: 'Gate 8',
    timezone: 'UTC+12',
  },
  LAX: {
    code: 'LAX',
    name: 'Los Angeles International Airport',
    city: 'Los Angeles',
    country: 'United States',
    flag: '🇺🇸',
    x: 80,
    y: 220,
    terminal: 'Tom Bradley Int Terminal',
    defaultGate: '130',
    timezone: 'UTC-7',
  },
};

export const BOARDING_POINTS: AirportInfo[] = [
  AIRPORT_REGISTRY.LHR,
  AIRPORT_REGISTRY.JFK,
  AIRPORT_REGISTRY.CDG,
  AIRPORT_REGISTRY.FRA,
  AIRPORT_REGISTRY.SFO,
  AIRPORT_REGISTRY.HND,
  AIRPORT_REGISTRY.SIN,
  AIRPORT_REGISTRY.DXB,
];

export const DESTINATION_AIRPORTS: AirportInfo[] = [
  AIRPORT_REGISTRY.SYD,
  AIRPORT_REGISTRY.HND,
  AIRPORT_REGISTRY.JFK,
  AIRPORT_REGISTRY.AKL,
  AIRPORT_REGISTRY.LAX,
  AIRPORT_REGISTRY.LHR,
  AIRPORT_REGISTRY.SIN,
  AIRPORT_REGISTRY.CDG,
];

export interface PresetFlightCorridor {
  id: string;
  name: string;
  tagline: string;
  origin: string;
  hub: HubCode;
  destination: string;
  recommendedAirline: string;
}

export const PRESET_CORRIDORS: PresetFlightCorridor[] = [
  {
    id: 'kangaroo-singapore',
    name: 'London to Sydney via Singapore',
    tagline: 'Kangaroo Trunk Line • Singapore Airlines A380/A350',
    origin: 'LHR',
    hub: 'SIN',
    destination: 'SYD',
    recommendedAirline: 'Singapore Airlines',
  },
  {
    id: 'kangaroo-doha',
    name: 'London to Sydney via Doha',
    tagline: 'Ultra-Comfort • Qatar Airways Qsuite Fleet',
    origin: 'LHR',
    hub: 'DOH',
    destination: 'SYD',
    recommendedAirline: 'Qatar Airways',
  },
  {
    id: 'kangaroo-dubai',
    name: 'London to Sydney via Dubai',
    tagline: 'Flagship A380 Sky Experience • Emirates',
    origin: 'LHR',
    hub: 'DXB',
    destination: 'SYD',
    recommendedAirline: 'Emirates',
  },
  {
    id: 'transatlantic-jfk-dubai-hnd',
    name: 'New York to Tokyo via Dubai',
    tagline: 'Transcontinental Corridor • Emirates B777/A380',
    origin: 'JFK',
    hub: 'DXB',
    destination: 'HND',
    recommendedAirline: 'Emirates',
  },
  {
    id: 'paris-doha-sydney',
    name: 'Paris to Sydney via Doha',
    tagline: 'Mediterranean & Arabian Sea Route',
    origin: 'CDG',
    hub: 'DOH',
    destination: 'SYD',
    recommendedAirline: 'Qatar Airways',
  },
  {
    id: 'frankfurt-sin-akl',
    name: 'Frankfurt to Auckland via Singapore',
    tagline: 'Far Eastern Pacific Trunk • Singapore Airlines',
    origin: 'FRA',
    hub: 'SIN',
    destination: 'AKL',
    recommendedAirline: 'Singapore Airlines',
  },
  {
    id: 'sfo-sin-syd',
    name: 'San Francisco to Sydney via Singapore',
    tagline: 'Transpacific Southern Cross Corridor',
    origin: 'SFO',
    hub: 'SIN',
    destination: 'SYD',
    recommendedAirline: 'Singapore Airlines',
  },
];

export function getAirportWeather(code: string): AirportWeather {
  const airport = AIRPORT_REGISTRY[code] || AIRPORT_REGISTRY.LHR;
  const weatherMap: Record<string, AirportWeather> = {
    LHR: {
      airportCode: 'LHR',
      city: 'London',
      temperatureC: 14,
      wind: '240° at 11 kts',
      visibilityKm: 10,
      condition: 'Scattered clouds, light crosswind',
      metar: 'EGLL 231420Z 24011KT 9999 FEW025 SCT040 14/08 Q1018 NOSIG',
      runwayStatus: '27L/27R Active - Normal Flow',
    },
    JFK: {
      airportCode: 'JFK',
      city: 'New York',
      temperatureC: 18,
      wind: '180° at 9 kts',
      visibilityKm: 12,
      condition: 'Clear skies, optimal departure',
      metar: 'KJFK 231451Z 18009KT 10SM CLR 18/09 A3002 RMK AO2',
      runwayStatus: '13L/31R Active - Departure flow clear',
    },
    CDG: {
      airportCode: 'CDG',
      city: 'Paris',
      temperatureC: 16,
      wind: '210° at 7 kts',
      visibilityKm: 10,
      condition: 'Overcast, steady visibility',
      metar: 'LFPG 231430Z 21007KT 9999 OVC030 16/10 Q1016 NOSIG',
      runwayStatus: '09L/27R Active - Smooth traffic',
    },
    FRA: {
      airportCode: 'FRA',
      city: 'Frankfurt',
      temperatureC: 15,
      wind: '260° at 12 kts',
      visibilityKm: 10,
      condition: 'Partly cloudy, calm operations',
      metar: 'EDDF 231420Z 26012KT 9999 SCT035 15/07 Q1017 NOSIG',
      runwayStatus: '07R/25L Active - On Schedule',
    },
    SFO: {
      airportCode: 'SFO',
      city: 'San Francisco',
      temperatureC: 17,
      wind: '290° at 15 kts',
      visibilityKm: 15,
      condition: 'Pacific breeze, marine layer clear',
      metar: 'KSFO 231456Z 29015KT 10SM FEW015 17/11 A2998',
      runwayStatus: '28L/28R Active - Unrestricted',
    },
    HND: {
      airportCode: 'HND',
      city: 'Tokyo',
      temperatureC: 22,
      wind: '090° at 6 kts',
      visibilityKm: 10,
      condition: 'Fine autumn weather, calm bay',
      metar: 'RJTT 231430Z 09006KT 9999 FEW030 22/16 Q1015 NOSIG',
      runwayStatus: '16L/34R Active - On Schedule',
    },
    SIN: {
      airportCode: 'SIN',
      city: 'Singapore',
      temperatureC: 29,
      wind: '040° at 6 kts',
      visibilityKm: 10,
      condition: 'Scattered tropical cloud, smooth approaches',
      metar: 'WSSS 231430Z 04006KT 9999 FEW018 29/24 Q1009 NOSIG',
      runwayStatus: '02L/20R & 02C/20C Parallel ops nominal',
    },
    DXB: {
      airportCode: 'DXB',
      city: 'Dubai',
      temperatureC: 36,
      wind: '320° at 10 kts',
      visibilityKm: 8,
      condition: 'High thermal index, dry runway conditions',
      metar: 'OMDB 231400Z 32010KT 8000 NSC 36/19 Q1006 NOSIG',
      runwayStatus: '12L/30R Active - Minor spacing buffers in effect',
    },
    DOH: {
      airportCode: 'DOH',
      city: 'Doha',
      temperatureC: 34,
      wind: '340° at 8 kts',
      visibilityKm: 10,
      condition: 'Clear, light gulf haze, stable wind',
      metar: 'OTHH 231400Z 34008KT 9999 CAVOK 34/18 Q1007 NOSIG',
      runwayStatus: '16L/34R Dual active - Optimal flow',
    },
    SYD: {
      airportCode: 'SYD',
      city: 'Sydney',
      temperatureC: 19,
      wind: '180° at 14 kts',
      visibilityKm: 10,
      condition: 'Coastal southerly, clear radar approach',
      metar: 'YSSY 231400Z 18014KT 9999 SCT025 19/12 Q1022 NOSIG',
      runwayStatus: '16R Active - Curfew clock countdown operational',
    },
    AKL: {
      airportCode: 'AKL',
      city: 'Auckland',
      temperatureC: 16,
      wind: '220° at 12 kts',
      visibilityKm: 10,
      condition: 'Crisp Tasman air, unobstructed',
      metar: 'NZAA 231400Z 22012KT 9999 SCT030 16/10 Q1020 NOSIG',
      runwayStatus: '05R/23L Active - Normal Arrival',
    },
    LAX: {
      airportCode: 'LAX',
      city: 'Los Angeles',
      temperatureC: 21,
      wind: '250° at 8 kts',
      visibilityKm: 15,
      condition: 'Warm onshore airflow, ideal flight conditions',
      metar: 'KLAX 231450Z 25008KT 10SM CLR 21/13 A2994',
      runwayStatus: '24R/25L Active - High Capacity',
    },
  };

  return weatherMap[code] || {
    airportCode: airport.code,
    city: airport.city,
    temperatureC: 20,
    wind: '210° at 10 kts',
    visibilityKm: 10,
    condition: 'Standard meteorological profile, calm',
    metar: `${airport.code} 231400Z 21010KT 9999 CLR 20/12 Q1015 NOSIG`,
    runwayStatus: 'All Runways Active',
  };
}

/**
 * Builds dynamic flight legs and times for customized boarding point & destination
 */
export function buildDynamicItinerary(
  originCode: string,
  hubCode: HubCode,
  destCode: string,
  baseCarrier: string
): HubOption {
  const origin = AIRPORT_REGISTRY[originCode] || AIRPORT_REGISTRY.LHR;
  const dest = AIRPORT_REGISTRY[destCode] || AIRPORT_REGISTRY.SYD;
  const hub = AIRPORT_REGISTRY[hubCode] || AIRPORT_REGISTRY.SIN;
  const baseHubOption = HUB_OPTIONS[hubCode] || HUB_OPTIONS.SIN;

  // Approximate duration based on standard trunk timings
  let leg1Duration = '12h 45m';
  let leg2Duration = '7h 50m';
  let totalTime = '22h 35m';

  if (originCode === 'JFK' || originCode === 'SFO') {
    leg1Duration = '14h 20m';
    totalTime = '24h 10m';
  } else if (originCode === 'CDG' || originCode === 'FRA') {
    leg1Duration = '12h 15m';
    totalTime = '22h 05m';
  } else if (originCode === 'SIN' || originCode === 'DXB') {
    leg1Duration = '7h 30m';
    totalTime = '16h 40m';
  }

  if (destCode === 'HND') {
    leg2Duration = '6h 45m';
    totalTime = '20h 50m';
  } else if (destCode === 'AKL') {
    leg2Duration = '9h 30m';
    totalTime = '24h 15m';
  } else if (destCode === 'LAX' || destCode === 'JFK') {
    leg2Duration = '13h 10m';
    totalTime = '26h 55m';
  }

  const carrierPrefix = hubCode === 'SIN' ? 'SQ' : hubCode === 'DXB' ? 'EK' : 'QR';
  const flight1Num = `${carrierPrefix}${Math.floor(Math.random() * 20 + 300)}`;
  const flight2Num = `${carrierPrefix}${Math.floor(Math.random() * 20 + 200)}`;

  const leg1: FlightLeg = {
    flightNumber: flight1Num,
    airline: baseCarrier,
    aircraft: 'Airbus A380-800',
    origin: origin.code,
    originName: origin.name,
    destination: hub.code,
    destinationName: hub.name,
    departureTimeUTC: '14:00',
    arrivalTimeUTC: '02:45+1',
    duration: leg1Duration,
    seat: '02A',
    cabin: 'First Class Suite',
    gate: origin.defaultGate,
    terminal: origin.terminal,
    status: 'BOARDING',
  };

  const leg2: FlightLeg = {
    flightNumber: flight2Num,
    airline: baseCarrier,
    aircraft: 'Airbus A380-800',
    origin: hub.code,
    originName: hub.name,
    destination: dest.code,
    destinationName: dest.name,
    departureTimeUTC: '04:45+1',
    arrivalTimeUTC: '12:35+1',
    duration: leg2Duration,
    seat: '02A',
    cabin: 'First Class Suite',
    gate: hub.defaultGate,
    terminal: hub.terminal,
    status: 'SCHEDULED',
  };

  return {
    ...baseHubOption,
    carrier: baseCarrier,
    leg1,
    leg2,
    totalFlightTime: totalTime,
  };
}
