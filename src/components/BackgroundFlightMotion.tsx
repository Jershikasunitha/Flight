import { useEffect, useState } from 'react';
import { HubCode, WorldwideLocation } from '../types';

interface BackgroundFlightMotionProps {
  activeHub: HubCode;
  originLocation?: WorldwideLocation;
  destinationLocation?: WorldwideLocation;
}

export function BackgroundFlightMotion({
  activeHub,
  originLocation,
  destinationLocation,
}: BackgroundFlightMotionProps) {
  // Hub waypoint coordinates normalized for 1000x600 viewBox
  const hubCoords: Record<HubCode, { x: number; y: number; code: string; name: string }> = {
    SIN: { x: 670, y: 350, code: 'SIN', name: 'Singapore' },
    DXB: { x: 500, y: 260, code: 'DXB', name: 'Dubai' },
    DOH: { x: 480, y: 270, code: 'DOH', name: 'Doha' },
  };

  // Convert lat/lng to SVG 1000x600 canvas coordinate projection
  const projectCoords = (coords?: { lat: number; lng: number }, defaultX = 220, defaultY = 160) => {
    if (!coords || typeof coords.lat !== 'number' || typeof coords.lng !== 'number') {
      return { x: defaultX, y: defaultY };
    }
    // Equirectangular approximation bounded inside safe canvas margins
    const x = Math.round(50 + ((coords.lng + 180) / 360) * 900);
    const y = Math.round(40 + ((90 - coords.lat) / 180) * 520);
    return { x: Math.max(80, Math.min(920, x)), y: Math.max(60, Math.min(540, y)) };
  };

  const origProjected = projectCoords(originLocation?.coordinates, 220, 160);
  const destProjected = projectCoords(destinationLocation?.coordinates, 880, 490);

  const originPoint = {
    x: origProjected.x,
    y: origProjected.y,
    code: originLocation?.code || originLocation?.city?.slice(0, 3).toUpperCase() || 'LHR',
    name: originLocation?.city || 'London',
  };

  const destPoint = {
    x: destProjected.x,
    y: destProjected.y,
    code: destinationLocation?.code || destinationLocation?.city?.slice(0, 3).toUpperCase() || 'SYD',
    name: destinationLocation?.city || 'Sydney',
  };

  const currentHub = hubCoords[activeHub] || hubCoords.SIN;

  // Path from Origin -> Hub -> Destination
  // Using quadratic curves for realistic Great-Circle arc curvature
  const leg1ControlX = (originPoint.x + currentHub.x) / 2 - 20;
  const leg1ControlY = Math.min(originPoint.y, currentHub.y) - 50;
  const leg1Path = `M ${originPoint.x} ${originPoint.y} Q ${leg1ControlX} ${leg1ControlY} ${currentHub.x} ${currentHub.y}`;

  const leg2ControlX = (currentHub.x + destPoint.x) / 2 + 20;
  const leg2ControlY = Math.min(currentHub.y, destPoint.y) - 40;
  const leg2Path = `M ${currentHub.x} ${currentHub.y} Q ${leg2ControlX} ${leg2ControlY} ${destPoint.x} ${destPoint.y}`;

  const fullTrajectoryPath = `${leg1Path} Q ${leg2ControlX} ${leg2ControlY} ${destPoint.x} ${destPoint.y}`;

  return (
    <div 
      id="voya-background-flight-canvas"
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none"
    >
      {/* Soft atmospheric gradient mesh */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F7F4EC] via-[#F4EFE5] to-[#EFE8DC] opacity-80" />

      {/* SVG Canvas for Flight Paths and Gliding Aircraft */}
      <svg
        className="absolute w-full h-full object-cover opacity-45 sm:opacity-55"
        viewBox="0 0 1000 600"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Subtle grid pattern */}
          <pattern id="bg-flight-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#DDD4C4" strokeWidth="0.5" strokeDasharray="2,4" />
          </pattern>

          {/* Gradient for flight contrails */}
          <linearGradient id="contrail-glow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C2410C" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#C2410C" stopOpacity="0.1" />
          </linearGradient>

          {/* Secondary flight path gradient */}
          <linearGradient id="traffic-glow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#64748B" stopOpacity="0" />
            <stop offset="50%" stopColor="#64748B" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#64748B" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Global Cartographic Latitude / Longitude Airway Grid */}
        <rect width="100%" height="100%" fill="url(#bg-flight-grid)" opacity="0.6" />

        {/* Atmospheric Airway Isobars / Geodesic Curves */}
        <g stroke="#DDD6C8" strokeWidth="0.8" fill="none" opacity="0.5">
          <ellipse cx="500" cy="300" rx="460" ry="240" strokeDasharray="3,6" />
          <ellipse cx="500" cy="300" rx="340" ry="170" strokeDasharray="2,5" />
          <path d="M 50 300 Q 500 120 950 300" strokeDasharray="4,8" />
          <path d="M 50 380 Q 500 240 950 380" strokeDasharray="3,6" />
        </g>

        {/* Ambient Secondary Crossing Flight Routes */}
        <g stroke="url(#traffic-glow)" strokeWidth="1.2" fill="none" strokeDasharray="4,8">
          <path d="M 120 480 Q 420 320 820 120" />
          <path d="M 280 80 Q 600 240 920 360" />
        </g>

        {/* Secondary Cruiser High-Altitude Plane (Drifting across background) */}
        <g className="animate-bg-traffic-drift">
          <path
            d="M 0 0 L 14 0 L 17 4 L 17 6 L 14 5 L 8 13 L 6 13 L 8 5 L 2 5 L 0 7 L -1 7 L 0 4 L 0 0 Z"
            fill="#B8AF9E"
            transform="translate(180, 290) rotate(24) scale(0.7)"
          />
          <text x="195" y="302" fill="#A89F8E" fontSize="8" fontFamily="IBM Plex Mono">
            BA11 • FL390
          </text>
        </g>

        {/* PRIMARY ACTIVE FLIGHT CORRIDOR (LHR -> ACTIVE HUB -> SYD) */}
        {/* Glow halo */}
        <path
          d={fullTrajectoryPath}
          fill="none"
          stroke="#FDBA74"
          strokeWidth="6"
          opacity="0.35"
          strokeLinecap="round"
        />

        {/* Animated Dashed Trajectory Line */}
        <path
          d={fullTrajectoryPath}
          fill="none"
          stroke="url(#contrail-glow)"
          strokeWidth="2.2"
          strokeDasharray="8,6"
          strokeLinecap="round"
          className="animate-flight-dash"
        />

        {/* WAYPOINT PINGS & RADAR RINGS */}
        {/* Origin */}
        <g transform={`translate(${originPoint.x}, ${originPoint.y})`}>
          <circle r="12" fill="none" stroke="#C2410C" strokeWidth="0.8" opacity="0.3" className="animate-ping" />
          <circle r="4" fill="#C2410C" />
          <circle r="1.5" fill="#FFFFFF" />
          <text x="-8" y="-10" fill="#1E2022" fontSize="9" fontWeight="bold" fontFamily="IBM Plex Mono">
            {originPoint.code}
          </text>
          <text x="-8" y="-2" fill="#78716C" fontSize="7" fontFamily="IBM Plex Mono">
            DEP 14:00
          </text>
        </g>

        {/* Transit Hub: SIN / DXB / DOH */}
        <g transform={`translate(${currentHub.x}, ${currentHub.y})`}>
          <circle r="16" fill="none" stroke="#D97706" strokeWidth="1" opacity="0.4" className="animate-ping" />
          <circle r="5" fill="#D97706" />
          <circle r="2" fill="#FFFFFF" />
          <text x="8" y="-6" fill="#D97706" fontSize="10" fontWeight="bold" fontFamily="IBM Plex Mono">
            {currentHub.code}
          </text>
          <text x="8" y="4" fill="#78716C" fontSize="7" fontFamily="IBM Plex Mono">
            TRANSIT HUB
          </text>
        </g>

        {/* Destination */}
        <g transform={`translate(${destPoint.x}, ${destPoint.y})`}>
          <circle r="14" fill="none" stroke="#059669" strokeWidth="0.8" opacity="0.3" className="animate-ping" />
          <circle r="4.5" fill="#059669" />
          <circle r="1.5" fill="#FFFFFF" />
          <text x="8" y="3" fill="#059669" fontSize="9" fontWeight="bold" fontFamily="IBM Plex Mono">
            {destPoint.code}
          </text>
          <text x="8" y="11" fill="#78716C" fontSize="7" fontFamily="IBM Plex Mono">
            ARR 20:45
          </text>
        </g>

        {/* ANIMATED GLIDING PRIMARY PASSENGER AIRCRAFT (VOYA FLIGHT) */}
        {/* We animate this along the trajectory with a gentle banking motion and glowing contrail */}
        <g className="animate-gliding-plane-primary">
          {/* Pulsing Jet Wake / Contrail */}
          <path
            d="M -30 0 L -8 0"
            stroke="#EA580C"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.8"
            className="animate-pulse"
          />
          <path
            d="M -50 0 L -25 0"
            stroke="#FDBA74"
            strokeWidth="1.5"
            strokeDasharray="2,3"
            opacity="0.5"
          />

          {/* Aircraft Silhouette (Top-Down Aviation Vector) */}
          <g transform="scale(1.2)">
            {/* Radar glow circle */}
            <circle cx="0" cy="0" r="10" fill="#C2410C" opacity="0.15" />
            
            {/* Plane body */}
            <path
              d="M 12 0 
                 C 10 -1.5, 4 -2, -2 -2 
                 L -5 -12 
                 L -8 -12 
                 L -6 -2 
                 L -12 -2 
                 L -14 -6 
                 L -16 -6 
                 L -15 0 
                 L -16 6 
                 L -14 6 
                 L -12 2 
                 L -6 2 
                 L -8 12 
                 L -5 12 
                 L -2 2 
                 C 4 2, 10 1.5, 12 0 Z"
              fill="#C2410C"
              stroke="#FAF8F3"
              strokeWidth="0.8"
            />
            {/* Cockpit dot */}
            <circle cx="6" cy="0" r="0.9" fill="#FAF8F3" />
          </g>

          {/* Live Flight Telemetry Tag drifting alongside */}
          <g transform="translate(14, -12)">
            <rect
              x="0"
              y="-10"
              width="62"
              height="16"
              rx="3"
              fill="#FAF8F3"
              stroke="#DDD6C8"
              strokeWidth="0.6"
              opacity="0.9"
            />
            <text x="5" y="1" fill="#C2410C" fontSize="7.5" fontWeight="bold" fontFamily="IBM Plex Mono">
              VOYA-01
            </text>
            <text x="38" y="1" fill="#78716C" fontSize="6.5" fontFamily="IBM Plex Mono">
              FL370
            </text>
          </g>
        </g>
      </svg>
    </div>
  );
}
