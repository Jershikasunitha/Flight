import { 
  GitBranch, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Check, 
  ArrowRight,
  TrendingUp,
  Percent,
  Luggage,
  Sparkles
} from 'lucide-react';
import { 
  DecisionAnalysis, 
  HubCode, 
  DisruptionEvent,
  WorldwideLocation
} from '../types';
import { useLanguage } from '../context/LanguageContext';
import { RiskTrendChart } from './RiskTrendChart';

interface DecisionAgentProps {
  decision: DecisionAnalysis;
  activeHub: HubCode;
  disruption: DisruptionEvent | null;
  onApplyReroute: (hub: HubCode) => void;
  originLocation?: WorldwideLocation;
  destinationLocation?: WorldwideLocation;
}

export function DecisionAgent({
  decision,
  activeHub,
  disruption,
  onApplyReroute,
  originLocation,
  destinationLocation,
}: DecisionAgentProps) {
  const { t, isRTL } = useLanguage();
  const getRiskColor = (score: number) => {
    if (score >= 70) return 'text-[#DC2626] bg-[#FEF2F2] border-[#FCA5A5]';
    if (score >= 35) return 'text-amber-700 bg-amber-50 border-amber-300';
    return 'text-emerald-700 bg-emerald-50 border-emerald-300';
  };

  const getRiskMeterWidth = (score: number) => {
    return `${Math.min(100, Math.max(5, score))}%`;
  };

  return (
    <div id="decision-agent-view" className="space-y-6">
      {/* Agent Banner */}
      <div className="bg-[#FAF8F5] border border-[#E6E1D8] rounded-xl p-5 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C2410C]"></span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#C2410C]">
                {t.agent3Title}
              </span>
            </div>
            <h2 className="text-xl font-display font-bold text-[#1E2022] mt-1">
              {t.curfewRiskAnalysis}
            </h2>
            <p className="text-xs text-[#5A606A] mt-0.5">
              {t.agent3Desc}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-mono font-bold px-3 py-1 rounded-lg border ${getRiskColor(decision.riskScore)}`}>
              {t.status}: {decision.riskLevel} ({decision.riskScore}/100)
            </span>
          </div>
        </div>
      </div>

      {/* Risk Metrics Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Composite Risk Score */}
        <div className="bg-white border border-[#E6E1D8] rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-mono text-[#8C929A]">
            <span>OVERALL RISK INDEX</span>
            <TrendingUp className="w-3.5 h-3.5 text-[#C2410C]" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className={`text-3xl font-display font-bold ${
              decision.riskScore >= 70 ? 'text-[#DC2626]' : decision.riskScore >= 35 ? 'text-amber-600' : 'text-emerald-600'
            }`}>
              {decision.riskScore}
            </span>
            <span className="text-xs font-mono text-[#8C929A]">/ 100</span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-[#EFECE6] h-2 rounded-full overflow-hidden mt-3">
            <div 
              className={`h-full transition-all duration-500 rounded-full ${
                decision.riskScore >= 70 ? 'bg-[#DC2626]' : decision.riskScore >= 35 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: getRiskMeterWidth(decision.riskScore) }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-[#8C929A] mt-1.5">
            <span>0 LOW</span>
            <span>50 MED</span>
            <span>100 HIGH</span>
          </div>
        </div>

        {/* Misconnect Probability */}
        <div className="bg-white border border-[#E6E1D8] rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-mono text-[#8C929A]">
            <span>MISCONNECT PROBABILITY</span>
            <Percent className="w-3.5 h-3.5 text-[#C2410C]" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className={`text-3xl font-display font-bold ${
              decision.connectionFailureProbability >= 50 ? 'text-[#DC2626]' : decision.connectionFailureProbability >= 20 ? 'text-amber-600' : 'text-emerald-600'
            }`}>
              {decision.connectionFailureProbability}%
            </span>
          </div>
          <p className="text-[11px] text-[#5A606A] mt-2 leading-relaxed">
            {decision.connectionFailureProbability >= 50 
              ? 'Critical deficit: Hub connection time breaches MCT.'
              : 'Connection time safely above airline minimum.'}
          </p>
        </div>

        {/* Sydney Curfew Hazard */}
        <div className="bg-white border border-[#E6E1D8] rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-mono text-[#8C929A]">
            <span>SYDNEY 23:00 CURFEW</span>
            <Clock className="w-3.5 h-3.5 text-[#C2410C]" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className={`text-3xl font-display font-bold ${
              decision.curfewWarning ? 'text-[#DC2626]' : 'text-emerald-600'
            }`}>
              {decision.curfewMarginMinutes}m
            </span>
            <span className="text-xs font-mono text-[#8C929A]">buffer</span>
          </div>
          <p className="text-[11px] text-[#5A606A] mt-2 leading-relaxed">
            {decision.curfewWarning 
              ? 'Warning: Runway 34L diversion risk post-23:00 curfew.' 
              : 'Safe arrival projected well ahead of 23:00 curfew lock.'}
          </p>
        </div>

        {/* Baggage Transfer Risk */}
        <div className="bg-white border border-[#E6E1D8] rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-mono text-[#8C929A]">
            <span>BAGGAGE TRANSIT RISK</span>
            <Luggage className="w-3.5 h-3.5 text-[#C2410C]" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className={`text-2xl font-display font-bold ${
              decision.baggageTransferRisk === 'CRITICAL' ? 'text-[#DC2626]' : decision.baggageTransferRisk === 'ELEVATED' ? 'text-amber-600' : 'text-emerald-600'
            }`}>
              {decision.baggageTransferRisk}
            </span>
          </div>
          <p className="text-[11px] text-[#5A606A] mt-2 leading-relaxed">
            {decision.baggageTransferRisk === 'CRITICAL' 
              ? 'Baggage separation imminent without reroute.' 
              : 'Express RFID tag tracking active in ramp system.'}
          </p>
        </div>
      </div>

      {/* D3.js En-Route Risk Trajectory & Predictive Trend Chart */}
      <RiskTrendChart 
        activeHub={activeHub} 
        disruption={disruption} 
        decision={decision} 
      />

      {/* Explicit Decision-Tree Path Flowchart */}
      <div className="bg-white border border-[#E6E1D8] rounded-xl p-5 shadow-2xs">
        <div className="flex items-center justify-between border-b border-[#EFECE6] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-[#C2410C]" />
            <h3 className="font-display font-bold text-sm text-[#1E2022]">
              Explicit Decision-Tree Resolution Flow
            </h3>
          </div>
          <span className="text-xs font-mono text-[#8C929A]">
            Autonomous deterministic logic sequence
          </span>
        </div>

        <div className="space-y-3">
          {decision.decisionTree.map((step, idx) => {
            const isPass = step.status === 'PASS';
            const isFail = step.status === 'FAIL';
            const isWarn = step.status === 'WARNING';
            const isActive = step.status === 'ACTIVE';

            return (
              <div 
                key={step.id} 
                className={`p-3.5 rounded-lg border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs ${
                  isFail 
                    ? 'bg-red-50/70 border-red-200' 
                    : isWarn 
                      ? 'bg-amber-50/70 border-amber-200'
                      : isActive
                        ? 'bg-orange-50 border-[#C2410C]/40'
                        : 'bg-[#FAF8F5] border-[#E6E1D8]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center font-mono font-bold text-[11px] shrink-0 mt-0.5 bg-[#1E2022] text-white">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="font-display font-bold text-sm text-[#1E2022]">
                      {step.stage}
                    </div>
                    <div className="font-mono text-[11px] text-[#5A606A] mt-0.5">
                      Rule: {step.condition}
                    </div>
                    <div className="text-[11px] mt-1 font-medium text-[#1E2022]">
                      Outcome: <strong className={isFail ? 'text-red-700' : isWarn ? 'text-amber-800' : 'text-[#1E2022]'}>{step.result}</strong>
                    </div>
                  </div>
                </div>

                <div className="self-end sm:self-center shrink-0">
                  <span className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                    isFail 
                      ? 'bg-red-200 text-red-900' 
                      : isWarn 
                        ? 'bg-amber-200 text-amber-900'
                        : isActive
                          ? 'bg-[#C2410C] text-white'
                          : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {step.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Route Comparison Table */}
      <div className="bg-white border border-[#E6E1D8] rounded-xl p-5 shadow-2xs overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#EFECE6] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <h3 className="font-display font-bold text-sm text-[#1E2022]">
              Cross-Hub Corridor Feasibility Comparison
            </h3>
          </div>
          <span className="text-xs font-mono text-[#8C929A]">
            Benchmarked against Elena Rostova's traveler preferences
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="border-b border-[#E6E1D8] bg-[#FAF8F5] text-[#5A606A]">
                <th className="py-2.5 px-3 font-semibold">Corridor & Carrier</th>
                <th className="py-2.5 px-3 font-semibold">Flights</th>
                <th className="py-2.5 px-3 font-semibold">Transfer Buffer</th>
                <th className="py-2.5 px-3 font-semibold">{destinationLocation?.city || 'Destination'} Arrival</th>
                <th className="py-2.5 px-3 font-semibold">Curfew Margin</th>
                <th className="py-2.5 px-3 font-semibold">Seats Open</th>
                <th className="py-2.5 px-3 font-semibold text-center">Status</th>
                <th className="py-2.5 px-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFECE6]">
              {decision.comparisons.map((row) => {
                const isSelected = activeHub === row.hub;
                const isHighRisk = row.feasibility === 'HIGH_RISK';
                const isRecommended = row.feasibility === 'RECOMMENDED';

                return (
                  <tr 
                    key={row.hub}
                    className={`hover:bg-[#FAF8F5] transition-colors ${
                      isSelected ? 'bg-orange-50/40 font-medium' : ''
                    }`}
                  >
                    <td className="py-3 px-3">
                      <div className="font-display font-bold text-[#1E2022]">{row.hubName}</div>
                      <div className="text-[11px] text-[#8C929A]">{row.carrier}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-[#1E2022]">{row.flight1} / {row.flight2}</span>
                      <div className="text-[10px] text-[#8C929A]">{row.totalTime}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`font-bold ${
                        row.connectionBufferMinutes < 45 ? 'text-red-600' : 'text-emerald-700'
                      }`}>
                        {row.connectionBufferMinutes} min
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[#1E2022]">
                      {row.sydneyArrivalLocal}
                    </td>
                    <td className="py-3 px-3">
                      <span className={row.curfewMarginMinutes < 60 ? 'text-amber-700 font-bold' : 'text-emerald-700'}>
                        +{row.curfewMarginMinutes}m safe
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[#5A606A] text-[11px]">
                      {row.seatAvailability}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isHighRisk 
                          ? 'bg-red-100 text-red-800' 
                          : isRecommended 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-amber-100 text-amber-800'
                      }`}>
                        {row.feasibility.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {isSelected ? (
                        <span className="text-[11px] font-mono text-[#C2410C] font-bold">
                          ACTIVE
                        </span>
                      ) : (
                        <button
                          id={`btn-reroute-to-${row.hub}`}
                          onClick={() => onApplyReroute(row.hub)}
                          className="px-2.5 py-1 rounded bg-[#1E2022] hover:bg-[#C2410C] text-white text-[11px] font-mono font-medium transition-colors"
                        >
                          Switch Route
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
