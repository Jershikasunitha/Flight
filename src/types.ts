export type HubCode = 'SIN' | 'DXB' | 'DOH';

export interface FlightLeg {
  flightNumber: string;
  airline: string;
  aircraft: string;
  origin: string;
  originName: string;
  destination: string;
  destinationName: string;
  departureTimeUTC: string;
  arrivalTimeUTC: string;
  duration: string;
  seat: string;
  cabin: string;
  gate: string;
  terminal: string;
  status: 'SCHEDULED' | 'BOARDING' | 'EN_ROUTE' | 'HOLD' | 'DELAYED';
}

export interface HubOption {
  code: HubCode;
  name: string;
  city: string;
  country: string;
  carrier: string;
  alliance: string;
  leg1: FlightLeg;
  leg2: FlightLeg;
  scheduledLayoverMinutes: number;
  minTransferTimeMinutes: number;
  totalFlightTime: string;
  aircraftTypeLeg1: string;
  aircraftTypeLeg2: string;
  hubPerks: string;
}

export interface DisruptionEvent {
  id: string;
  title: string;
  type: 'WEATHER' | 'ATC' | 'CREW' | 'AIRCRAFT';
  severity: 'NONE' | 'LOW' | 'MEDIUM' | 'CRITICAL';
  delayMinutes: number;
  location: string;
  description: string;
  impactedHub: HubCode;
}

export interface AirportWeather {
  airportCode: string;
  city: string;
  temperatureC: number;
  wind: string;
  visibilityKm: number;
  condition: string;
  metar: string;
  runwayStatus: string;
}

export interface TelemetryData {
  flightNumber: string;
  aircraft: string;
  altitudeFt: number;
  groundSpeedKts: number;
  headingDeg: number;
  currentWaypoint: string;
  distanceCoveredNm: number;
  distanceRemainingNm: number;
  etaUTC: string;
}

export interface DecisionTreeStep {
  id: string;
  stage: string;
  condition: string;
  result: string;
  status: 'PASS' | 'WARNING' | 'FAIL' | 'ACTIVE';
}

export interface RouteComparisonItem {
  hub: HubCode;
  hubName: string;
  carrier: string;
  flight1: string;
  flight2: string;
  totalTime: string;
  connectionBufferMinutes: number;
  sydneyArrivalLocal: string;
  curfewMarginMinutes: number;
  seatAvailability: string;
  riskScore: number;
  feasibility: 'RECOMMENDED' | 'FEASIBLE' | 'HIGH_RISK' | 'VIOLATION';
}

export interface DecisionAnalysis {
  riskScore: number; // 0 - 100
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  connectionFailureProbability: number; // percentage
  curfewWarning: boolean;
  curfewMarginMinutes: number; // Sydney curfew is 23:00 local
  baggageTransferRisk: 'LOW' | 'ELEVATED' | 'CRITICAL';
  passengerFatigueIndex: number; // 1-10
  decisionTree: DecisionTreeStep[];
  comparisons: RouteComparisonItem[];
}

export interface FlightRiskTrendPoint {
  hour: number; // 0 to 22
  timeLabel: string; // e.g. "T+00h", "T+12h"
  waypoint: string; // e.g. "LHR Takeoff", "Changi Layover"
  flightPhase: 'CLIMB' | 'CRUISE_LEG1' | 'HUB_TRANSIT' | 'CRUISE_LEG2' | 'APPROACH_SYD';
  historicalRisk: number; // 0 - 100 baseline
  predictedRisk: number; // 0 - 100 active projection
  predictedRiskLower: number; // 95% confidence lower
  predictedRiskUpper: number; // 95% confidence upper
  riskDriver: string; // Commentary string
}

export interface ExecutionPlan {
  actionTitle: string;
  actionSummary: string;
  confidenceScore: number; // e.g. 96
  selectedRoute: HubCode;
  rerouteFlights?: {
    leg1: string;
    leg2: string;
    carrier: string;
  };
  reasoningPoints: string[];
  travelerNotified: boolean;
  notifiedAt?: string;
  notificationChannels: string[];
  compensationVoucher?: {
    code: string;
    type: string;
    amount: string;
  };
}

export interface TravelerProfile {
  name: string;
  pnr: string;
  loyaltyTier: string;
  loyaltyProgram: string;
  preferredSeat: string;
  minTransferPreferenceMinutes: number;
  contactMobile: string;
  specialRequests: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'vyra' | 'vira';
  text: string;
  timestamp: string;
  isAudio?: boolean;
}

export interface CorridorHistoricalStats {
  hub: HubCode;
  carrier: string;
  onTimeArrivalRatePercent: number;
  averageEnrouteDelayMinutes: number;
  historicalMisconnectRatePercent: number;
  cancellationRatePercent: number;
  weatherDisruptionRiskLevel: 'LOW' | 'MEDIUM' | 'ELEVATED';
  avgCurfewArrivalMarginMinutes: number;
  terminalTransitEfficiencyRating: number;
  primaryAdvantage: string;
  primaryVulnerability: string;
}

export interface HistoricalFlightData {
  corridors: Record<HubCode, CorridorHistoricalStats>;
  travelerHistory: {
    totalPastCorridorFlights: number;
    preferredCarrier: string;
    pastMisconnectIncident: string;
    successfulConnectionsRate: number;
  };
  terminalTransitAverages: Record<HubCode, {
    avgTransitMinutes: number;
    baggageTransferSuccessRatePercent: number;
    tarmacEscortSpeedMinutes: number;
  }>;
}

export interface AgentDecisionLog {
  id: string;
  timestamp: string;
  agentName: 'Planner Agent' | 'Monitor Agent' | 'Decision Agent' | 'Execution Agent';
  action: string;
  primaryRationale: string;
  evaluatedAlternatives: string[];
  rejectedReason: string;
  confidenceScore: number;
  keyFactors: {
    curfewProtectionMinutes: number;
    onTimePerformance: string;
    passengerPreferenceMatch: string;
    bufferSafetyMargin: string;
  };
}

export type LocationType = 'airport' | 'rail' | 'port' | 'ferry' | 'city' | 'country' | 'custom';

export interface WorldwideLocation {
  id: string;
  name: string;
  code?: string;
  city: string;
  country: string;
  region: 'Asia' | 'Europe' | 'North America' | 'South America' | 'Africa' | 'Oceania' | 'Global';
  type: LocationType;
  coordinates: { lat: number; lng: number };
  flag: string;
  aliases?: string[];
}

export interface WorldwideJourneyState {
  origin: WorldwideLocation;
  destination: WorldwideLocation;
}

export interface TripState {
  originLocation: WorldwideLocation;
  destinationLocation: WorldwideLocation;
  activeHub: HubCode;
  activeItinerary: HubOption;
  disruption: DisruptionEvent | null;
  connectionBufferMinutes: number;
  telemetry: TelemetryData;
  weather: {
    origin: AirportWeather;
    hub: AirportWeather;
    destination: AirportWeather;
  };
  decision: DecisionAnalysis;
  execution: ExecutionPlan;
  traveler: TravelerProfile;
  monitoringCycleCount: number;
  lastScannedAt: string;
  historicalData: HistoricalFlightData;
  decisionLogs: AgentDecisionLog[];
}
