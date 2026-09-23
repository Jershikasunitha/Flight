import { 
  CheckCircle2, 
  Send, 
  ShieldCheck, 
  BellRing, 
  Sparkles, 
  Ticket, 
  ArrowRight,
  Plane,
  FileCheck,
  Smartphone,
  Check
} from 'lucide-react';
import { ExecutionPlan, TravelerProfile, HubCode } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface ExecutionAgentProps {
  execution: ExecutionPlan;
  traveler: TravelerProfile;
  activeHub: HubCode;
  onNotifyTraveler: () => void;
  isNotified: boolean;
  onOpenVira: () => void;
}

export function ExecutionAgent({
  execution,
  traveler,
  activeHub,
  onNotifyTraveler,
  isNotified,
  onOpenVira,
}: ExecutionAgentProps) {
  const { t, isRTL } = useLanguage();
  return (
    <div id="execution-agent-view" className="space-y-6">
      {/* Agent Banner */}
      <div className="bg-[#FAF8F5] border border-[#E6E1D8] rounded-xl p-5 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C2410C]"></span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#C2410C]">
                {t.agent4Title}
              </span>
            </div>
            <h2 className="text-xl font-display font-bold text-[#1E2022] mt-1">
              {t.recommendedAction}
            </h2>
            <p className="text-xs text-[#5A606A] mt-0.5">
              {t.agent4Desc}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
              {t.dispatchReady}
            </span>
          </div>
        </div>
      </div>

      {/* Final Recommended Action Plan Card */}
      <div className="bg-white border-2 border-[#C2410C]/30 rounded-xl p-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-[#C2410C] text-white text-[10px] font-mono font-bold px-3 py-1 rounded-bl-lg">
          AUTONOMOUS ACTION PLAN
        </div>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#C2410C]/10 text-[#C2410C] flex items-center justify-center shrink-0 mt-1">
            <FileCheck className="w-6 h-6" />
          </div>
          <div className="space-y-2 flex-1">
            <div className="text-xs font-mono text-[#8C929A] uppercase tracking-wider">
              Optimal Resolution Strategy
            </div>
            <h3 className="text-xl font-display font-bold text-[#1E2022] leading-tight">
              {execution.actionTitle}
            </h3>
            <p className="text-xs text-[#5A606A] leading-relaxed">
              {execution.actionSummary}
            </p>

            {execution.rerouteFlights && (
              <div className="mt-4 p-3.5 bg-[#FAF8F5] rounded-lg border border-[#E6E1D8] font-mono text-xs">
                <div className="text-[10px] uppercase text-[#8C929A] font-bold mb-2">
                  Confirmed Rebooking Inventory:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#1E2022]">
                  <div className="flex items-center gap-2 bg-white p-2 rounded border border-[#EFECE6]">
                    <Plane className="w-3.5 h-3.5 text-[#C2410C]" />
                    <span>Leg 1: <strong>{execution.rerouteFlights.leg1}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 bg-white p-2 rounded border border-[#EFECE6]">
                    <Plane className="w-3.5 h-3.5 text-[#C2410C]" />
                    <span>Leg 2: <strong>{execution.rerouteFlights.leg2}</strong></span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Confidence Meter (Gold/Amber Ops Aesthetic) */}
        <div className="mt-6 pt-5 border-t border-[#EFECE6]">
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="font-semibold text-[#1E2022]">Autonomous System Confidence</span>
            </div>
            <span className="font-bold text-[#D97706] text-sm">
              {execution.confidenceScore}% High Reliability
            </span>
          </div>
          <div className="w-full bg-[#EFECE6] h-3 rounded-full overflow-hidden p-0.5 border border-[#DDD7CD]">
            <div 
              className="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-amber-500 via-[#FB923C] to-[#C2410C]"
              style={{ width: `${execution.confidenceScore}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-[#8C929A] mt-1.5">
            <span>Minimum Viable: 75%</span>
            <span>Policy Threshold: 85%</span>
            <span className="text-[#D97706] font-bold">Consensus: {execution.confidenceScore}%</span>
          </div>
        </div>
      </div>

      {/* Operational Reasoning Breakdown */}
      <div className="bg-white border border-[#E6E1D8] rounded-xl p-5 shadow-2xs">
        <div className="flex items-center justify-between border-b border-[#EFECE6] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#C2410C]" />
            <h3 className="font-display font-bold text-sm text-[#1E2022]">
              Operational Reasoning & Justification Log
            </h3>
          </div>
          <span className="text-xs font-mono text-[#8C929A]">
            Audit Trail for Airline Ops Desk
          </span>
        </div>

        <ul className="space-y-2.5">
          {execution.reasoningPoints.map((point, index) => (
            <li key={index} className="flex items-start gap-3 text-xs text-[#40454D]">
              <div className="w-5 h-5 rounded-full bg-[#FAF8F5] border border-[#DDD7CD] flex items-center justify-center shrink-0 mt-0.5 text-[#C2410C] font-mono text-[10px] font-bold">
                ✓
              </div>
              <span className="leading-relaxed">{point}</span>
            </li>
          ))}
        </ul>

        {execution.compensationVoucher && (
          <div className="mt-4 p-3.5 bg-amber-50/70 border border-amber-200 rounded-lg flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <Ticket className="w-4 h-4 text-amber-700" />
              <div>
                <span className="font-bold text-amber-900">Auto-Issued Traveler Benefit:</span>
                <div className="text-[11px] text-amber-800">{execution.compensationVoucher.amount}</div>
              </div>
            </div>
            <span className="font-mono text-[11px] bg-white px-2 py-1 rounded border border-amber-300 font-bold text-amber-900">
              {execution.compensationVoucher.code}
            </span>
          </div>
        )}
      </div>

      {/* Notify Traveler & VYRA Handshake Action Box */}
      <div className="bg-[#FAF8F5] border border-[#E6E1D8] rounded-xl p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-[#C2410C]" />
              <h3 className="font-display font-bold text-sm text-[#1E2022]">
                Traveler Handshake & Notification Dispatch
              </h3>
            </div>
            <p className="text-xs text-[#5A606A] mt-1">
              Transmit flight updates to passenger <strong>{traveler.name}</strong> ({traveler.contactMobile}) and arm VYRA chatbot with live context.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Notify Button */}
            <button
              id="btn-notify-traveler"
              onClick={onNotifyTraveler}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-mono font-bold transition-all shadow-sm active:scale-95 ${
                isNotified
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-[#C2410C] hover:bg-[#A33408] text-white'
              }`}
            >
              {isNotified ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Traveler Notified & Synced</span>
                </>
              ) : (
                <>
                  <BellRing className="w-4 h-4" />
                  <span>Notify Traveler & Ping VYRA</span>
                </>
              )}
            </button>

            {/* Quick Ping VYRA */}
            <button
              id="btn-open-vira-from-execution"
              onClick={onOpenVira}
              className="px-3.5 py-2.5 rounded-lg bg-[#1E2022] hover:bg-[#2E3339] text-white text-xs font-mono font-medium transition-colors"
            >
              Open VYRA
            </button>
          </div>
        </div>

        {isNotified && (
          <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center justify-between font-mono animate-fade-in">
            <span>✓ SMS & Mobile Wallet push dispatched to {traveler.contactMobile}. VYRA ready to converse.</span>
            <span className="text-[10px] text-emerald-600">DELIVERED</span>
          </div>
        )}
      </div>
    </div>
  );
}
