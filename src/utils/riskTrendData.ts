import { FlightRiskTrendPoint, HubCode, DisruptionEvent, DecisionAnalysis } from '../types';

export function computeFlightRiskTrend(
  activeHub: HubCode,
  disruption: DisruptionEvent | null,
  decision: DecisionAnalysis
): FlightRiskTrendPoint[] {
  const isDisrupted = !!disruption && disruption.severity !== 'NONE';
  const impactedHub = disruption?.impactedHub;
  const isCurrentHubImpacted = isDisrupted && impactedHub === activeHub;
  const delay = isCurrentHubImpacted ? disruption.delayMinutes : 0;

  // Base waypoint definitions across the 22h LHR -> Hub -> SYD corridor
  const waypoints = [
    { hour: 0.0, timeLabel: 'T+00.0h', waypoint: 'LHR Departure (RWY 27R)', phase: 'CLIMB' as const },
    { hour: 2.5, timeLabel: 'T+02.5h', waypoint: 'Alps / Central Europe', phase: 'CRUISE_LEG1' as const },
    { hour: 5.0, timeLabel: 'T+05.0h', waypoint: 'Black Sea / Anatolia', phase: 'CRUISE_LEG1' as const },
    { hour: 7.5, timeLabel: 'T+07.5h', waypoint: 'Middle East / Gulf Corridor', phase: 'CRUISE_LEG1' as const },
    { hour: 10.0, timeLabel: 'T+10.0h', waypoint: `${activeHub} TMA Inbound Approach`, phase: 'HUB_TRANSIT' as const },
    { hour: 11.5, timeLabel: 'T+11.5h', waypoint: `${activeHub} Touchdown & Taxi`, phase: 'HUB_TRANSIT' as const },
    { hour: 12.5, timeLabel: 'T+12.5h', waypoint: `${activeHub} Connection & Baggage Transfer`, phase: 'HUB_TRANSIT' as const },
    { hour: 14.0, timeLabel: 'T+14.0h', waypoint: 'Leg 2 Climb & Ocean Ingress', phase: 'CRUISE_LEG2' as const },
    { hour: 16.5, timeLabel: 'T+16.5h', waypoint: 'Equatorial Oceanic Cruise', phase: 'CRUISE_LEG2' as const },
    { hour: 18.5, timeLabel: 'T+18.5h', waypoint: 'North Australia (Darwin TMA)', phase: 'CRUISE_LEG2' as const },
    { hour: 20.5, timeLabel: 'T+20.5h', waypoint: 'Outback Airway (Alice Springs)', phase: 'CRUISE_LEG2' as const },
    { hour: 22.0, timeLabel: 'T+22.0h', waypoint: 'Sydney Kingsford Smith (RWY 34L)', phase: 'APPROACH_SYD' as const },
  ];

  // Baseline historical risk by hour (based on Elena's past 14 journeys & corridor OTP)
  const historicalBaseline = [12, 14, 15, 18, 22, 25, 29, 20, 16, 15, 18, 22];

  return waypoints.map((wp, idx) => {
    const hist = historicalBaseline[idx];
    let pred = hist;
    let driver = 'Nominal Jetstream & Standard ATC Flow';

    if (isCurrentHubImpacted) {
      if (activeHub === 'SIN' && delay >= 90) {
        // Severe storm in Bay of Bengal / Malacca
        if (wp.hour <= 2.5) {
          pred = 14 + wp.hour * 2;
          driver = 'Advisory: Convective cell tracked en route';
        } else if (wp.hour <= 7.5) {
          pred = 24 + (wp.hour - 2.5) * 4;
          driver = 'Airway diversion in progress (+25m)';
        } else if (wp.hour <= 10.0) {
          pred = 68;
          driver = 'Severe holding expected over Malacca';
        } else if (wp.hour <= 12.5) {
          pred = 86; // Peak critical misconnect
          driver = 'CRITICAL: Layover compressed below 45m MCT';
        } else if (wp.hour <= 14.0) {
          pred = 82;
          driver = 'Leg 2 departure delayed or rebooking required';
        } else if (wp.hour <= 18.5) {
          pred = 78;
          driver = 'Sydney curfew arrival buffer degraded';
        } else {
          pred = 88;
          driver = 'HIGH RISK: 23:00 Sydney curfew violation threat';
        }
      } else if (activeHub === 'DXB') {
        // ATC Hold
        if (wp.hour <= 5.0) {
          pred = 16;
          driver = 'Pre-departure advisory for Gulf flow';
        } else if (wp.hour <= 7.5) {
          pred = 42;
          driver = 'ATC metering hold inbound to Dubai';
        } else if (wp.hour <= 11.5) {
          pred = 56;
          driver = '45m sequencing delay at DXB';
        } else if (wp.hour <= 12.5) {
          pred = 52;
          driver = 'Tight 55m layover at Concourse A';
        } else if (wp.hour <= 18.5) {
          pred = 32;
          driver = 'Leg 2 on time, steady tailwinds';
        } else {
          pred = 44; // DXB has small 45m curfew buffer
          driver = 'Curfew margin tight (45m)';
        }
      } else if (activeHub === 'DOH') {
        // Crew timeout
        if (wp.hour <= 7.5) {
          pred = 20;
          driver = 'Minor staging hold';
        } else if (wp.hour <= 12.5) {
          pred = 50;
          driver = 'Relief crew swap delay at Hamad';
        } else {
          pred = 24;
          driver = '200m curfew margin protects Sydney arrival';
        }
      }
    } else {
      // Nominal or alternate non-impacted hub (e.g. DOH when SIN is disrupted)
      if (activeHub === 'DOH') {
        pred = Math.max(8, hist - 5);
        driver = 'Optimal Oneworld corridor, 200m curfew margin';
      } else if (activeHub === 'DXB') {
        pred = Math.max(12, hist - 2);
        driver = 'Direct First suite route, standard 45m curfew cushion';
      } else {
        pred = Math.max(9, hist - 6);
        driver = 'Nominal Changi operations, 325m curfew cushion';
      }
    }

    // Clamp predicted risk to 0-100
    pred = Math.min(100, Math.max(5, Math.round(pred)));

    // Calculate 95% confidence variance interval bounds (increases with forecast distance)
    const varianceSpread = wp.hour <= 5 ? 4 : wp.hour <= 12 ? 6 : 9;
    const lower = Math.max(0, pred - varianceSpread);
    const upper = Math.min(100, pred + varianceSpread);

    return {
      hour: wp.hour,
      timeLabel: wp.timeLabel,
      waypoint: wp.waypoint,
      flightPhase: wp.phase,
      historicalRisk: hist,
      predictedRisk: pred,
      predictedRiskLower: lower,
      predictedRiskUpper: upper,
      riskDriver: driver,
    };
  });
}
