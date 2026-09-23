import { 
  Plane, 
  X, 
  Sparkles, 
  Radio, 
  Volume2, 
  Mic, 
  ShieldCheck, 
  ArrowRight,
  ExternalLink,
  Bot
} from 'lucide-react';
import { TripState } from '../types';

interface ViraLogoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenChat: () => void;
  tripState: TripState;
}

export function ViraLogoModal({
  isOpen,
  onClose,
  onOpenChat,
  tripState,
}: ViraLogoModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      id="vira-logo-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        id="vira-logo-modal-content"
        className="w-full max-w-lg bg-[#FAF8F3] border-2 border-[#DDD6C8] rounded-2xl shadow-2xl p-6 sm:p-8 relative text-[#1E2022] overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="close-vira-logo-modal"
          onClick={onClose}
          aria-label="Close VYRA Emblem Modal"
          className="absolute top-4 right-4 p-2 rounded-full bg-[#EFECE4] hover:bg-[#E5DFD3] text-[#5A606A] hover:text-[#1E2022] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Ambient background glow & grid lines */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-[#C2410C]/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Logo Presentation Box */}
        <div className="text-center relative">
          {/* Radar Circles & Iconic Emblem */}
          <div className="relative inline-flex items-center justify-center my-3">
            {/* Outer animated radar ring */}
            <div className="absolute w-32 h-32 rounded-full border border-[#C2410C]/25 animate-ping opacity-40 pointer-events-none" />
            <div className="absolute w-26 h-26 rounded-full border border-[#C2410C]/40 pointer-events-none" />
            <div className="absolute w-20 h-20 rounded-full bg-[#C2410C]/10 pointer-events-none" />

            {/* Core Plane Icon Circle with Moving Flight Motion */}
            <div className="relative w-18 h-18 rounded-2xl bg-gradient-to-tr from-[#A33408] via-[#C2410C] to-[#EA580C] text-white flex items-center justify-center shadow-xl shadow-[#C2410C]/30 animate-vira-badge">
              <div className="relative flex items-center justify-center">
                <Plane className="w-9 h-9 text-white animate-vira-plane drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]" />
                {/* Moving jet thrust particle */}
                <span className="absolute -bottom-1.5 -left-1.5 w-3 h-3 rounded-full bg-amber-300 opacity-80 animate-vira-thrust filter blur-[0.5px]" />
                <span className="absolute -bottom-3 -left-3 w-2 h-2 rounded-full bg-orange-400 opacity-60 animate-ping" />
              </div>
            </div>

            {/* AI Beacon Badge */}
            <div className="absolute -top-1 -right-1 bg-amber-500 text-white p-1.5 rounded-full shadow-md animate-bounce" style={{ animationDuration: '3s' }}>
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Typography & Identity */}
          <div className="mt-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#EFECE4] border border-[#DDD6C8] text-[11px] font-mono font-bold text-[#C2410C] uppercase tracking-wider mb-1.5">
              <Radio className="w-3 h-3 text-[#C2410C] animate-pulse" />
              <span>Autonomous Flight Concierge</span>
            </div>
            <h2 className="text-3xl font-display font-bold text-[#1E2022] tracking-tight">
              VYRA
            </h2>
            <div className="text-xs font-mono font-semibold text-[#8C929A] mt-0.5 uppercase tracking-widest">
              VOYA Yield & Reconnaissance Assistant
            </div>
            <p className="text-xs text-[#5A606A] mt-3 max-w-sm mx-auto leading-relaxed">
              Grounded conversational intelligence synchronizing traveler Elena Rostova with the 4-agent dispatch matrix on London Heathrow (LHR) → Sydney (SYD).
            </p>
          </div>

          {/* Real-Time Telemetry Grounding Strip */}
          <div className="mt-5 p-3.5 bg-white border border-[#E2DCCE] rounded-xl text-left text-xs font-mono shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-[11px] text-[#8C929A] border-b border-[#F0ECE1] pb-1.5">
              <span>LIVE TELEMETRY GROUNDING</span>
              <span className="text-emerald-700 font-bold">● SYNCHRONIZED</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-[#8C929A]">Active Hub:</span>{' '}
                <strong className="text-[#1E2022]">{tripState.activeHub} ({tripState.activeItinerary.carrier})</strong>
              </div>
              <div>
                <span className="text-[#8C929A]">Layover Buffer:</span>{' '}
                <strong className={tripState.connectionBufferMinutes < 45 ? 'text-red-600' : 'text-emerald-700'}>
                  {tripState.connectionBufferMinutes} min
                </strong>
              </div>
              <div>
                <span className="text-[#8C929A]">Curfew Buffer:</span>{' '}
                <strong className="text-[#1E2022]">+{tripState.decision.curfewMarginMinutes}m</strong>
              </div>
              <div>
                <span className="text-[#8C929A]">Ops Status:</span>{' '}
                <strong className={tripState.disruption ? 'text-red-600' : 'text-emerald-700'}>
                  {tripState.disruption ? 'DISRUPTED' : 'NOMINAL'}
                </strong>
              </div>
            </div>
          </div>

          {/* Capabilities feature pills */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] font-mono text-[#5A606A]">
            <span className="px-2.5 py-1 bg-[#EFECE4] rounded-lg border border-[#DDD6C8] flex items-center gap-1">
              <Mic className="w-3 h-3 text-[#C2410C]" /> Speech Recognition
            </span>
            <span className="px-2.5 py-1 bg-[#EFECE4] rounded-lg border border-[#DDD6C8] flex items-center gap-1">
              <Volume2 className="w-3 h-3 text-amber-600" /> Voice Readback
            </span>
            <span className="px-2.5 py-1 bg-[#EFECE4] rounded-lg border border-[#DDD6C8] flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" /> Grounded in Telemetry
            </span>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row items-center gap-3 justify-center">
            <button
              id="modal-launch-chat-btn"
              onClick={() => {
                onClose();
                onOpenChat();
              }}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#C2410C] hover:bg-[#A33408] text-white text-xs font-mono font-bold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
            >
              <Plane className="w-3.5 h-3.5 -rotate-45" />
              <span>Launch VYRA Chatbot</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              id="modal-dismiss-btn"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#EFECE4] hover:bg-[#E5DFD3] text-[#1E2022] text-xs font-mono font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { ViraLogoModal as VyraLogoModal };
