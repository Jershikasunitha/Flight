import { useState, useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import { HubCode, DisruptionEvent, DecisionAnalysis, FlightRiskTrendPoint } from '../types';
import { computeFlightRiskTrend } from '../utils/riskTrendData';
import { useLanguage } from '../context/LanguageContext';
import { 
  TrendingUp, 
  AlertTriangle, 
  ShieldCheck, 
  Info, 
  Clock, 
  Eye, 
  EyeOff, 
  SlidersHorizontal,
  Compass,
  Plane
} from 'lucide-react';

interface RiskTrendChartProps {
  activeHub: HubCode;
  disruption: DisruptionEvent | null;
  decision: DecisionAnalysis;
}

export function RiskTrendChart({
  activeHub,
  disruption,
  decision,
}: RiskTrendChartProps) {
  const { t, isRTL } = useLanguage();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 340 });

  // Interactive toggle states
  const [showHistorical, setShowHistorical] = useState(true);
  const [showPredicted, setShowPredicted] = useState(true);
  const [showConfidence, setShowConfidence] = useState(true);
  const [showZones, setShowZones] = useState(true);
  const [selectedPoint, setSelectedPoint] = useState<FlightRiskTrendPoint | null>(null);

  // Compute trend data dynamically
  const trendData = useMemo(() => {
    return computeFlightRiskTrend(activeHub, disruption, decision);
  }, [activeHub, disruption, decision]);

  // Compute summary metrics
  const maxPredicted = useMemo(() => {
    return Math.max(...trendData.map((d) => d.predictedRisk));
  }, [trendData]);

  const avgHistorical = useMemo(() => {
    const sum = trendData.reduce((acc, curr) => acc + curr.historicalRisk, 0);
    return Math.round(sum / trendData.length);
  }, [trendData]);

  const peakDivergencePoint = useMemo(() => {
    return [...trendData].sort(
      (a, b) => Math.abs(b.predictedRisk - b.historicalRisk) - Math.abs(a.predictedRisk - a.historicalRisk)
    )[0];
  }, [trendData]);

  // ResizeObserver for responsive sizing
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        if (width > 0) {
          // Responsive height adapting to container width
          const responsiveHeight = width < 500 ? 290 : width < 800 ? 330 : 360;
          setDimensions({ width, height: responsiveHeight });
        }
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Main D3 Rendering Effect
  useEffect(() => {
    if (!svgRef.current || dimensions.width === 0 || dimensions.height === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clean slate for declarative re-renders

    const { width, height } = dimensions;
    const margin = {
      top: 30,
      right: width < 600 ? 25 : 45,
      bottom: 45,
      left: width < 600 ? 35 : 48,
    };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    if (innerWidth <= 0 || innerHeight <= 0) return;

    // Define X & Y scales
    const xScale = d3
      .scaleLinear()
      .domain([0, 22]) // Flight duration: 0h to 22h
      .range([margin.left, width - margin.right]);

    const yScale = d3
      .scaleLinear()
      .domain([0, 100]) // Risk score: 0 to 100
      .range([height - margin.bottom, margin.top]);

    // Defs for gradients & clip-paths
    const defs = svg.append('defs');

    // Gradient for Confidence Interval Area
    const confidenceGradient = defs
      .append('linearGradient')
      .attr('id', 'confidence-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    confidenceGradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', maxPredicted >= 70 ? '#DC2626' : '#C2410C')
      .attr('stop-opacity', 0.22);

    confidenceGradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#C2410C')
      .attr('stop-opacity', 0.04);

    // Gradient for Predicted Line Glow
    const lineGlow = defs
      .append('linearGradient')
      .attr('id', 'predicted-line-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '0%');

    lineGlow.append('stop').attr('offset', '0%').attr('stop-color', '#EA580C');
    lineGlow.append('stop').attr('offset', '50%').attr('stop-color', maxPredicted >= 70 ? '#DC2626' : '#C2410C');
    lineGlow.append('stop').attr('offset', '100%').attr('stop-color', maxPredicted >= 70 ? '#B91C1C' : '#9A3412');

    // 1. Threshold Zones (Background Bands)
    if (showZones) {
      const zonesGroup = svg.append('g').attr('class', 'zones-group');

      // Critical Risk Zone (70 - 100)
      zonesGroup
        .append('rect')
        .attr('x', margin.left)
        .attr('y', yScale(100))
        .attr('width', innerWidth)
        .attr('height', yScale(70) - yScale(100))
        .attr('fill', '#FEF2F2')
        .attr('opacity', 0.85);

      // Elevated Risk Zone (35 - 70)
      zonesGroup
        .append('rect')
        .attr('x', margin.left)
        .attr('y', yScale(70))
        .attr('width', innerWidth)
        .attr('height', yScale(35) - yScale(70))
        .attr('fill', '#FFFBEB')
        .attr('opacity', 0.65);

      // Nominal Safety Zone (0 - 35)
      zonesGroup
        .append('rect')
        .attr('x', margin.left)
        .attr('y', yScale(35))
        .attr('width', innerWidth)
        .attr('height', yScale(0) - yScale(35))
        .attr('fill', '#F0FDF4')
        .attr('opacity', 0.45);

      // Threshold Dividing Lines & Badges
      // 70 Line (Intervention Trigger)
      zonesGroup
        .append('line')
        .attr('x1', margin.left)
        .attr('x2', width - margin.right)
        .attr('y1', yScale(70))
        .attr('y2', yScale(70))
        .attr('stroke', '#FCA5A5')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '4,3');

      zonesGroup
        .append('text')
        .attr('x', width - margin.right - 6)
        .attr('y', yScale(70) - 4)
        .attr('text-anchor', 'end')
        .attr('fill', '#DC2626')
        .attr('font-size', '9px')
        .attr('font-family', 'monospace')
        .attr('font-weight', 'bold')
        .text('70: INTERVENTION CEILING');

      // 35 Line (Nominal Boundary)
      zonesGroup
        .append('line')
        .attr('x1', margin.left)
        .attr('x2', width - margin.right)
        .attr('y1', yScale(35))
        .attr('y2', yScale(35))
        .attr('stroke', '#FDE68A')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '4,3');

      zonesGroup
        .append('text')
        .attr('x', width - margin.right - 6)
        .attr('y', yScale(35) - 4)
        .attr('text-anchor', 'end')
        .attr('fill', '#D97706')
        .attr('font-size', '9px')
        .attr('font-family', 'monospace')
        .attr('font-weight', 'bold')
        .text('35: NOMINAL CAP');
    }

    // 2. Hub Layover Window Shaded Vertical Band (10h to 13h)
    const hubBand = svg.append('g').attr('class', 'hub-window-band');
    hubBand
      .append('rect')
      .attr('x', xScale(10.0))
      .attr('y', margin.top)
      .attr('width', xScale(13.0) - xScale(10.0))
      .attr('height', innerHeight)
      .attr('fill', '#C2410C')
      .attr('opacity', 0.05);

    hubBand
      .append('line')
      .attr('x1', xScale(10.0))
      .attr('x2', xScale(10.0))
      .attr('y1', margin.top)
      .attr('y2', height - margin.bottom)
      .attr('stroke', '#C2410C')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '2,2')
      .attr('opacity', 0.4);

    hubBand
      .append('line')
      .attr('x1', xScale(13.0))
      .attr('x2', xScale(13.0))
      .attr('y1', margin.top)
      .attr('y2', height - margin.bottom)
      .attr('stroke', '#C2410C')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '2,2')
      .attr('opacity', 0.4);

    hubBand
      .append('text')
      .attr('x', (xScale(10.0) + xScale(13.0)) / 2)
      .attr('y', margin.top + 12)
      .attr('text-anchor', 'middle')
      .attr('fill', '#C2410C')
      .attr('font-size', '9px')
      .attr('font-family', 'monospace')
      .attr('font-weight', 'bold')
      .text(`${activeHub} HUB LAYOVER`);

    // 3. Sydney 23:00 Curfew Lockout Vertical Marker (T+21.5h to T+22h)
    const curfewGroup = svg.append('g').attr('class', 'curfew-barrier-marker');
    curfewGroup
      .append('rect')
      .attr('x', xScale(21.0))
      .attr('y', margin.top)
      .attr('width', xScale(22.0) - xScale(21.0))
      .attr('height', innerHeight)
      .attr('fill', '#DC2626')
      .attr('opacity', 0.08);

    curfewGroup
      .append('line')
      .attr('x1', xScale(22.0))
      .attr('x2', xScale(22.0))
      .attr('y1', margin.top)
      .attr('y2', height - margin.bottom)
      .attr('stroke', '#DC2626')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '3,3');

    // 4. Subtle Grid Lines (Horizontal & Vertical)
    const gridGroup = svg.append('g').attr('class', 'grid-lines');

    // Y Gridlines
    const yTicks = [0, 25, 50, 75, 100];
    gridGroup
      .selectAll('.y-grid')
      .data(yTicks)
      .enter()
      .append('line')
      .attr('class', 'y-grid')
      .attr('x1', margin.left)
      .attr('x2', width - margin.right)
      .attr('y1', (d) => yScale(d))
      .attr('y2', (d) => yScale(d))
      .attr('stroke', '#E2DCD2')
      .attr('stroke-width', 0.75)
      .attr('stroke-dasharray', '2,4');

    // X Gridlines
    const xTicks = [0, 4, 8, 12, 16, 20, 22];
    gridGroup
      .selectAll('.x-grid')
      .data(xTicks)
      .enter()
      .append('line')
      .attr('class', 'x-grid')
      .attr('x1', (d) => xScale(d))
      .attr('x2', (d) => xScale(d))
      .attr('y1', margin.top)
      .attr('y2', height - margin.bottom)
      .attr('stroke', '#EFECE6')
      .attr('stroke-width', 0.75);

    // 5. Current Aircraft Telemetry Marker (Simulated at T+6.5h)
    const currentProgressHour = 6.5;
    const progressX = xScale(currentProgressHour);
    const progressGroup = svg.append('g').attr('class', 'current-progress-marker');

    progressGroup
      .append('line')
      .attr('x1', progressX)
      .attr('x2', progressX)
      .attr('y1', margin.top)
      .attr('y2', height - margin.bottom)
      .attr('stroke', '#C2410C')
      .attr('stroke-width', 1.5);

    progressGroup
      .append('circle')
      .attr('cx', progressX)
      .attr('cy', yScale(18)) // Approx current risk
      .attr('r', 4.5)
      .attr('fill', '#C2410C')
      .attr('stroke', '#FFFFFF')
      .attr('stroke-width', 2);

    progressGroup
      .append('text')
      .attr('x', progressX + (isRTL ? -6 : 6))
      .attr('y', margin.top + 24)
      .attr('text-anchor', isRTL ? 'end' : 'start')
      .attr('fill', '#C2410C')
      .attr('font-size', '9px')
      .attr('font-family', 'monospace')
      .attr('font-weight', 'bold')
      .text('LIVE TELEMETRY (T+06.5h)');

    // 6. D3 Path Generators
    // Confidence Ribbon Area
    if (showConfidence && showPredicted) {
      const areaGen = d3
        .area<FlightRiskTrendPoint>()
        .x((d) => xScale(d.hour))
        .y0((d) => yScale(d.predictedRiskLower))
        .y1((d) => yScale(d.predictedRiskUpper))
        .curve(d3.curveMonotoneX);

      svg
        .append('path')
        .datum(trendData)
        .attr('class', 'confidence-ribbon')
        .attr('d', areaGen)
        .attr('fill', 'url(#confidence-gradient)');
    }

    // Historical Baseline Line & Points
    if (showHistorical) {
      const historicalLineGen = d3
        .line<FlightRiskTrendPoint>()
        .x((d) => xScale(d.hour))
        .y((d) => yScale(d.historicalRisk))
        .curve(d3.curveMonotoneX);

      svg
        .append('path')
        .datum(trendData)
        .attr('class', 'historical-line')
        .attr('d', historicalLineGen)
        .attr('fill', 'none')
        .attr('stroke', '#64748B') // Slate
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '5,4')
        .attr('opacity', 0.85);

      // Historical Glyphs (Small hollow diamond/circle)
      svg
        .append('g')
        .attr('class', 'historical-dots')
        .selectAll('circle')
        .data(trendData)
        .enter()
        .append('circle')
        .attr('cx', (d) => xScale(d.hour))
        .attr('cy', (d) => yScale(d.historicalRisk))
        .attr('r', 2.5)
        .attr('fill', '#FFFFFF')
        .attr('stroke', '#64748B')
        .attr('stroke-width', 1.5);
    }

    // Live Predicted Line & Interactive Points
    if (showPredicted) {
      const predictedLineGen = d3
        .line<FlightRiskTrendPoint>()
        .x((d) => xScale(d.hour))
        .y((d) => yScale(d.predictedRisk))
        .curve(d3.curveMonotoneX);

      svg
        .append('path')
        .datum(trendData)
        .attr('class', 'predicted-line')
        .attr('d', predictedLineGen)
        .attr('fill', 'none')
        .attr('stroke', 'url(#predicted-line-gradient)')
        .attr('stroke-width', 3)
        .attr('stroke-linecap', 'round');

      // Predicted Glyphs
      svg
        .append('g')
        .attr('class', 'predicted-dots')
        .selectAll('circle')
        .data(trendData)
        .enter()
        .append('circle')
        .attr('cx', (d) => xScale(d.hour))
        .attr('cy', (d) => yScale(d.predictedRisk))
        .attr('r', (d) => (d.predictedRisk >= 70 ? 4.5 : 3.5))
        .attr('fill', (d) => (d.predictedRisk >= 70 ? '#DC2626' : '#C2410C'))
        .attr('stroke', '#FFFFFF')
        .attr('stroke-width', 1.5)
        .style('cursor', 'pointer');
    }

    // 7. Axes Rendering
    // X-Axis (Flight Hours / Milestones)
    const xAxis = d3
      .axisBottom(xScale)
      .tickValues([0, 4, 8, 11.5, 14, 18, 22])
      .tickFormat((d) => {
        const val = d.valueOf();
        if (val === 0) return '0h (LHR)';
        if (val === 11.5) return `11.5h (${activeHub})`;
        if (val === 22) return '22h (SYD)';
        return `T+${val}h`;
      });

    const xAxisGroup = svg
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(xAxis);

    xAxisGroup.select('.domain').attr('stroke', '#DDD7CD');
    xAxisGroup.selectAll('.tick line').attr('stroke', '#DDD7CD');
    xAxisGroup
      .selectAll('.tick text')
      .attr('fill', '#5A606A')
      .attr('font-size', '10px')
      .attr('font-family', 'monospace')
      .attr('font-weight', '500')
      .attr('dy', '10px');

    // Y-Axis (Risk Score Index 0-100)
    const yAxis = d3
      .axisLeft(yScale)
      .tickValues([0, 25, 50, 75, 100])
      .tickFormat((d) => `${d}`);

    const yAxisGroup = svg
      .append('g')
      .attr('class', 'y-axis')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(yAxis);

    yAxisGroup.select('.domain').attr('stroke', '#DDD7CD');
    yAxisGroup.selectAll('.tick line').attr('stroke', '#DDD7CD');
    yAxisGroup
      .selectAll('.tick text')
      .attr('fill', '#5A606A')
      .attr('font-size', '10px')
      .attr('font-family', 'monospace');

    // Y-Axis Title
    svg
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -(height / 2))
      .attr('y', width < 600 ? 12 : 16)
      .attr('text-anchor', 'middle')
      .attr('fill', '#8C929A')
      .attr('font-size', '9px')
      .attr('font-family', 'monospace')
      .attr('font-weight', 'bold')
      .text('RISK INDEX (0 - 100)');

    // 8. Crosshair & Interactive Tracking Overlay
    const focusGroup = svg.append('g').attr('class', 'focus-group').style('display', 'none');

    // Vertical tracking crosshair
    const crosshair = focusGroup
      .append('line')
      .attr('class', 'focus-line')
      .attr('y1', margin.top)
      .attr('y2', height - margin.bottom)
      .attr('stroke', '#1E2022')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '3,3');

    // Focus point for Predicted
    const focusPredicted = focusGroup
      .append('circle')
      .attr('r', 6)
      .attr('fill', '#C2410C')
      .attr('stroke', '#FFFFFF')
      .attr('stroke-width', 2);

    // Focus point for Historical
    const focusHistorical = focusGroup
      .append('circle')
      .attr('r', 5)
      .attr('fill', '#64748B')
      .attr('stroke', '#FFFFFF')
      .attr('stroke-width', 1.5);

    // Bisector for finding nearest data point on mouse movement
    const bisectHour = d3.bisector<FlightRiskTrendPoint, number>((d) => d.hour).center;

    // Overlay Rect for capturing all mouse events
    svg
      .append('rect')
      .attr('class', 'overlay')
      .attr('x', margin.left)
      .attr('y', margin.top)
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .attr('fill', 'transparent')
      .style('cursor', 'crosshair')
      .on('mouseenter', () => {
        focusGroup.style('display', null);
      })
      .on('mouseleave', () => {
        focusGroup.style('display', 'none');
        setSelectedPoint(null);
      })
      .on('mousemove', (event) => {
        const [mouseX] = d3.pointer(event);
        const xVal = xScale.invert(mouseX);
        const idx = bisectHour(trendData, xVal);
        const d = trendData[Math.max(0, Math.min(trendData.length - 1, idx))];

        if (d) {
          const cx = xScale(d.hour);
          crosshair.attr('x1', cx).attr('x2', cx);
          focusPredicted.attr('cx', cx).attr('cy', yScale(d.predictedRisk));
          focusHistorical.attr('cx', cx).attr('cy', yScale(d.historicalRisk));
          setSelectedPoint(d);
        }
      });
  }, [dimensions, trendData, showHistorical, showPredicted, showConfidence, showZones, activeHub, isRTL, maxPredicted]);

  return (
    <div 
      id="decision-risk-trend-container" 
      className="bg-white border border-[#E6E1D8] rounded-xl p-5 shadow-2xs space-y-4"
    >
      {/* Top Header & Interactive Toggles */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#EFECE6] pb-3.5">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#C2410C]" />
            <h3 className="font-display font-bold text-sm text-[#1E2022]">
              En-Route Risk Trajectory & Predictive Variance
            </h3>
            <span className="text-[10px] bg-[#C2410C]/10 text-[#C2410C] font-mono px-2 py-0.5 rounded font-bold">
              D3 TEMPORAL ENGINE
            </span>
          </div>
          <p className="text-xs text-[#5A606A] mt-0.5">
            D3.js visualization comparing historical corridor baselines (14 past journeys) vs. live autonomous risk projections across the 22-hour flight envelope.
          </p>
        </div>

        {/* Quick Toggles */}
        <div className="flex items-center flex-wrap gap-2 text-xs font-mono">
          {/* Predicted Toggle */}
          <button
            onClick={() => setShowPredicted(!showPredicted)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-all ${
              showPredicted
                ? 'bg-[#C2410C] text-white border-[#C2410C] shadow-2xs'
                : 'bg-[#FAF8F5] text-[#8C929A] border-[#DDD7CD] hover:bg-white'
            }`}
            title="Toggle Live Predicted Trajectory"
          >
            <span className="w-2 h-2 rounded-full bg-white"></span>
            <span>Predicted</span>
          </button>

          {/* Historical Toggle */}
          <button
            onClick={() => setShowHistorical(!showHistorical)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-all ${
              showHistorical
                ? 'bg-[#475569] text-white border-[#475569] shadow-2xs'
                : 'bg-[#FAF8F5] text-[#8C929A] border-[#DDD7CD] hover:bg-white'
            }`}
            title="Toggle Historical 14-Trip Corridor Baseline"
          >
            <span className="w-2 h-2 rounded-full border border-white"></span>
            <span>Historical</span>
          </button>

          {/* Confidence Interval Ribbon Toggle */}
          <button
            onClick={() => setShowConfidence(!showConfidence)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-all ${
              showConfidence
                ? 'bg-[#FAF8F5] text-[#C2410C] border-[#C2410C]/50'
                : 'bg-[#FAF8F5] text-[#8C929A] border-[#DDD7CD]'
            }`}
            title="Toggle 95% Confidence Interval Ribbon"
          >
            <span>CI Cone</span>
          </button>

          {/* Safety Zones Toggle */}
          <button
            onClick={() => setShowZones(!showZones)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-all ${
              showZones
                ? 'bg-[#FAF8F5] text-[#1E2022] border-[#DDD7CD]'
                : 'bg-[#FAF8F5] text-[#8C929A] border-[#DDD7CD]'
            }`}
            title="Toggle Safety and Curfew Threshold Zones"
          >
            <span>Thresholds</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs">
        {/* Peak Predicted Risk */}
        <div className="bg-[#FAF8F5] p-2.5 rounded-lg border border-[#E6E1D8]">
          <span className="text-[10px] text-[#8C929A] block uppercase tracking-wider">
            Peak Predicted Risk
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className={`text-lg font-bold font-display ${
              maxPredicted >= 70 ? 'text-[#DC2626]' : maxPredicted >= 35 ? 'text-amber-600' : 'text-emerald-700'
            }`}>
              {maxPredicted}
            </span>
            <span className="text-[10px] text-[#8C929A]">/ 100</span>
            <span className={`text-[9px] px-1 py-0.2 rounded font-bold ml-1 ${
              maxPredicted >= 70 ? 'bg-red-100 text-red-800' : maxPredicted >= 35 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
            }`}>
              {maxPredicted >= 70 ? 'CRITICAL' : maxPredicted >= 35 ? 'ELEVATED' : 'NOMINAL'}
            </span>
          </div>
        </div>

        {/* Historical Mean */}
        <div className="bg-[#FAF8F5] p-2.5 rounded-lg border border-[#E6E1D8]">
          <span className="text-[10px] text-[#8C929A] block uppercase tracking-wider">
            Historical Baseline Mean
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-lg font-bold font-display text-[#475569]">
              {avgHistorical}
            </span>
            <span className="text-[10px] text-[#8C929A]">/ 100</span>
            <span className="text-[9px] bg-slate-100 text-slate-700 px-1 py-0.2 rounded font-medium ml-1">
              14 TRIPS
            </span>
          </div>
        </div>

        {/* Max Divergence Delta */}
        <div className="bg-[#FAF8F5] p-2.5 rounded-lg border border-[#E6E1D8]">
          <span className="text-[10px] text-[#8C929A] block uppercase tracking-wider">
            Max Risk Divergence
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            {peakDivergencePoint && (
              <>
                <span className={`text-lg font-bold font-display ${
                  peakDivergencePoint.predictedRisk - peakDivergencePoint.historicalRisk > 20
                    ? 'text-[#DC2626]'
                    : 'text-emerald-700'
                }`}>
                  {peakDivergencePoint.predictedRisk - peakDivergencePoint.historicalRisk > 0 ? '+' : ''}
                  {peakDivergencePoint.predictedRisk - peakDivergencePoint.historicalRisk}
                </span>
                <span className="text-[10px] text-[#8C929A]">pts at {peakDivergencePoint.timeLabel}</span>
              </>
            )}
          </div>
        </div>

        {/* Curfew Protection Margin */}
        <div className="bg-[#FAF8F5] p-2.5 rounded-lg border border-[#E6E1D8]">
          <span className="text-[10px] text-[#8C929A] block uppercase tracking-wider">
            Sydney Curfew Cushion
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className={`text-lg font-bold font-display ${
              decision.curfewWarning ? 'text-[#DC2626]' : 'text-emerald-700'
            }`}>
              {decision.curfewMarginMinutes}m
            </span>
            <span className="text-[10px] text-[#8C929A]">prior to 23:00</span>
          </div>
        </div>
      </div>

      {/* D3 Canvas Container */}
      <div 
        ref={containerRef} 
        className="w-full relative bg-[#FCFBF8] border border-[#DDD7CD] rounded-lg overflow-hidden select-none"
      >
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          className="w-full overflow-visible block"
        />

        {/* Interactive Floating Hover Card (Pinned on Mouseover) */}
        {selectedPoint && (
          <div 
            id="trend-chart-tooltip"
            className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs border border-[#DDD7CD] shadow-lg rounded-lg p-3 text-xs pointer-events-none max-w-[260px] animate-in fade-in duration-150 z-20 font-sans"
          >
            <div className="flex items-center justify-between border-b border-[#EFECE6] pb-1.5 mb-1.5 font-mono">
              <span className="font-bold text-[#C2410C]">{selectedPoint.timeLabel}</span>
              <span className="text-[10px] bg-[#EFECE6] px-1.5 py-0.2 rounded font-semibold text-[#1E2022]">
                {selectedPoint.flightPhase.replace('_', ' ')}
              </span>
            </div>

            <div className="font-display font-bold text-xs text-[#1E2022]">
              {selectedPoint.waypoint}
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-[#EFECE6] font-mono text-[11px]">
              <div>
                <span className="text-[#8C929A] block text-[9px]">LIVE PREDICTED</span>
                <strong className={`text-xs ${
                  selectedPoint.predictedRisk >= 70 ? 'text-[#DC2626]' : selectedPoint.predictedRisk >= 35 ? 'text-amber-600' : 'text-emerald-700'
                }`}>
                  {selectedPoint.predictedRisk}/100
                </strong>
                <span className="text-[9px] text-[#8C929A] block">
                  [{selectedPoint.predictedRiskLower} - {selectedPoint.predictedRiskUpper}]
                </span>
              </div>

              <div>
                <span className="text-[#8C929A] block text-[9px]">HISTORICAL BASE</span>
                <strong className="text-xs text-[#475569]">
                  {selectedPoint.historicalRisk}/100
                </strong>
                <span className={`text-[9px] block font-bold ${
                  selectedPoint.predictedRisk - selectedPoint.historicalRisk > 15
                    ? 'text-[#DC2626]'
                    : 'text-[#5A606A]'
                }`}>
                  Δ {selectedPoint.predictedRisk - selectedPoint.historicalRisk > 0 ? '+' : ''}
                  {selectedPoint.predictedRisk - selectedPoint.historicalRisk} pts
                </span>
              </div>
            </div>

            <p className="mt-2 text-[10px] text-[#5A606A] leading-tight bg-[#FAF8F5] p-1.5 rounded border border-[#E6E1D8]">
              <strong>Driver:</strong> {selectedPoint.riskDriver}
            </p>
          </div>
        )}
      </div>

      {/* Legend & Interpretive Guide */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#5A606A] pt-1">
        <div className="flex flex-wrap items-center gap-4 font-mono text-[11px]">
          {/* Live Predicted */}
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-1 bg-[#C2410C] rounded-full"></div>
            <span className="text-[#1E2022] font-semibold">Live Autonomous Prediction</span>
          </div>

          {/* Historical Baseline */}
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-0.5 border-t-2 border-dashed border-[#64748B]"></div>
            <span>Historical Baseline (14 Trips)</span>
          </div>

          {/* Confidence Interval */}
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-2.5 bg-[#C2410C]/20 rounded-xs border border-[#C2410C]/30"></div>
            <span>95% Confidence Envelope</span>
          </div>

          {/* Curfew Barrier */}
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-2.5 bg-red-100 border border-red-300 rounded-xs"></div>
            <span>Sydney 23:00 Curfew Barrier</span>
          </div>
        </div>

        {/* Live Status Hint */}
        <div className="text-[11px] font-mono text-[#8C929A] flex items-center gap-1">
          <Info className="w-3 h-3 text-[#C2410C]" />
          <span>Hover over waypoints to inspect step-by-step risk drivers</span>
        </div>
      </div>
    </div>
  );
}
