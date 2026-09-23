import { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Plane, 
  X, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  RotateCcw, 
  MessageSquare,
  Bot,
  User,
  Radio,
  Minimize2,
  ExternalLink,
  Info,
  FileText,
  History,
  TrendingUp,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ChevronDown,
  Globe,
  Play,
  Square
} from 'lucide-react';
import { ChatMessage, TripState } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelector } from './LanguageSelector';
import { LanguageCode } from '../types/language';
import { 
  SPEECH_LANGUAGES, 
  SpeechLanguageConfig, 
  getSpeechConfig 
} from '../data/speechRecognitionLanguages';
import { SpeechRecognitionModal } from './SpeechRecognitionModal';

interface ViraChatbotProps {
  isOpen: boolean;
  onToggle: () => void;
  tripState: TripState;
  onOpenStateReview?: () => void;
  onPopLogo?: () => void;
}

const QUESTION_BANK = [
  "Why did the Planner choose Singapore over Dubai?",
  "What do the previous Agent Decision Logs show?",
  "What is the historical on-time performance (OTP) for Singapore vs Doha?",
  "Why was Dubai rejected despite flying the A380?",
  "Why is Doha designated as the #1 contingency reroute?",
  "What is my connection buffer in the current hub?",
  "Will my flight arrive before the Sydney 23:00 curfew?",
  "What happens if my connection in Singapore drops below 45 minutes?",
  "What is Elena's past corridor connection history?",
  "Show me the operational reasoning behind the execution plan.",
];

export function ViraChatbot({
  isOpen,
  onToggle,
  tripState,
  onOpenStateReview,
  onPopLogo,
}: ViraChatbotProps) {
  const { language, t, isRTL } = useLanguage();

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'init-1',
      sender: 'vira',
      text: t.viraGreeting,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [activeChatTab, setActiveChatTab] = useState<'chat' | 'logs'>('chat');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechLang, setSpeechLang] = useState<LanguageCode>(language);
  const [isSpeechModalOpen, setIsSpeechModalOpen] = useState(false);
  const [isSpeechDropdownOpen, setIsSpeechDropdownOpen] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [speechNotice, setSpeechNotice] = useState<string | null>(null);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);

  // Sync speech recognition language with global language when changed
  useEffect(() => {
    setSpeechLang(language);
  }, [language]);

  // Check speech recognition support
  useEffect(() => {
    const SpeechRecognition = 
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setSpeechSupported(!!SpeechRecognition);
  }, []);

  // Active speech configuration
  const activeSpeechConfig = useMemo(() => getSpeechConfig(speechLang), [speechLang]);

  // Update initial message when language changes if no conversation has taken place yet
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length <= 1 && prev[0]?.sender === 'vira') {
        return [
          {
            id: 'init-1',
            sender: 'vira',
            text: t.viraGreeting,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ];
      }
      return prev;
    });
  }, [language, t.viraGreeting]);

  // Rotate suggested questions each time VYRA is opened or language changes
  useEffect(() => {
    if (isOpen) {
      rotateQuestions();
    }
  }, [isOpen, language]);

  const rotateQuestions = () => {
    const localizedDefaults = [t.q1, t.q2, t.q3, t.q4];
    const pool = [...localizedDefaults, ...QUESTION_BANK];
    const shuffled = pool.sort(() => 0.5 - Math.random());
    setSuggestedQuestions(shuffled.slice(0, 3));
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const toggleMic = () => {
    setSpeechNotice(null);
    const SpeechRecognition = 
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechNotice('Speech recognition is not natively supported in this browser environment. Opening 11-Language Voice Guide.');
      setIsSpeechModalOpen(true);
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch {}
      setIsListening(false);
      setInterimTranscript('');
      return;
    }

    try {
      // Cancel TTS before listening to prevent feedback
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      }

      const recognition = new SpeechRecognition();
      const config = getSpeechConfig(speechLang);
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = config.bcp47;

      recognition.onstart = () => {
        setIsListening(true);
        setInterimTranscript('');
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        if (interim) {
          setInterimTranscript(interim);
        }

        if (finalTranscript) {
          setInterimTranscript('');
          setInputText(finalTranscript);
          handleSendMessage(finalTranscript);
          setIsListening(false);
        }
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        setInterimTranscript('');
        if (event.error === 'not-allowed') {
          setSpeechNotice('Microphone permission blocked. Click here for 11-Language Voice Commands.');
        } else if (event.error === 'no-speech') {
          setSpeechNotice('No speech detected. Please try again.');
        } else {
          console.warn('Speech error notice:', event.error);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimTranscript('');
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.error('Failed to start speech recognition:', err);
      setIsListening(false);
      setSpeechNotice('Could not initialize microphone. Opening Voice Guide.');
      setIsSpeechModalOpen(true);
    }
  };

  const speakText = (text: string, langCode: LanguageCode = speechLang) => {
    if (!ttsEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const config = getSpeechConfig(langCode);
      utterance.rate = 1.02;
      utterance.pitch = 1.0;
      utterance.lang = config.bcp47;

      const voices = window.speechSynthesis.getVoices?.() || [];
      const targetPrefix = config.bcp47.split('-')[0].toLowerCase();
      const matchedVoice = voices.find(
        (v) => v.lang.toLowerCase() === config.bcp47.toLowerCase() || v.lang.toLowerCase().startsWith(targetPrefix)
      );
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error('TTS error:', err);
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const targetLang = speechLang || language;
      const response = await fetch('/api/vyra/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query.trim(),
          language: targetLang,
          tripState: {
            activeHub: tripState.activeHub,
            itinerary: {
              leg1: tripState.activeItinerary.leg1,
              leg2: tripState.activeItinerary.leg2,
              totalTime: tripState.activeItinerary.totalFlightTime,
            },
            disruption: tripState.disruption,
            connectionBufferMinutes: tripState.connectionBufferMinutes,
            decision: {
              riskLevel: tripState.decision.riskLevel,
              riskScore: tripState.decision.riskScore,
              failureProbability: tripState.decision.connectionFailureProbability,
              curfewWarning: tripState.decision.curfewWarning,
            },
            execution: {
              action: tripState.execution.actionTitle,
              confidence: tripState.execution.confidenceScore,
            },
            weather: {
              origin: `${tripState.weather.origin.city}: ${tripState.weather.origin.condition} (${tripState.weather.origin.temperatureC}°C)`,
              hub: `${tripState.weather.hub.city}: ${tripState.weather.hub.condition} (${tripState.weather.hub.temperatureC}°C)`,
              destination: `${tripState.weather.destination.city}: ${tripState.weather.destination.condition} (${tripState.weather.destination.temperatureC}°C)`,
            },
            historicalData: tripState.historicalData,
            decisionLogs: tripState.decisionLogs,
            traveler: tripState.traveler,
          },
          conversationHistory: messages.map((m) => ({
            role: m.sender === 'user' ? 'user' : 'model',
            text: m.text,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();
      const replyText = data.reply || "I am monitoring the current flight operations.";

      const botMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'vira',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
      speakText(replyText, targetLang);
    } catch (err: any) {
      console.error('Chat endpoint error:', err);
      const qLower = query.toLowerCase();
      let fallbackText = `Elena, I am connected to your flight telemetry via ${tripState.activeHub}. Connection buffer is currently ${tripState.connectionBufferMinutes} minutes with risk score ${tripState.decision.riskScore}/100.`;

      if (qLower.includes('why') || qLower.includes('dubai') || qLower.includes('dxb') || qLower.includes('planner') || qLower.includes('reason')) {
        fallbackText = `The VOYA Planner Agent selected Singapore (SQ305/SQ231) with a 94/100 score: it yields a massive 325-minute buffer before Sydney's 23:00 curfew, 91.4% historical on-time performance (OTP), and matches your KrisFlyer Solitaire suite preference. Dubai was rejected due to a hazardous 45-minute curfew cushion (landing 22:15 +1 with 28.5m avg historical delay), where any delay forces an emergency diversion to Melbourne.`;
      } else if (qLower.includes('otp') || qLower.includes('historical') || qLower.includes('history')) {
        fallbackText = `Corridor Historical On-Time Performance (OTP):\n• Singapore (SQ): 91.4% OTP, 11.2m avg delay, 325m curfew safety.\n• Doha (QR): 94.2% OTP, 8.8m avg delay, 200m curfew safety.\n• Dubai (EK): 84.1% OTP, 28.5m avg delay, 45m curfew safety.\nYour personal flight history: 8 corridor flights with a 98.2% successful connection rate.`;
      } else if (qLower.includes('log') || qLower.includes('audit')) {
        fallbackText = `Agent Decision Audit Logs:\n• Planner (T-14h): Evaluated 3 corridors; picked SIN (94/100) and designated DOH (92/100) as primary backup.\n• Monitor (T-6h): Telemetry & METAR nominal.\n• Decision (Current): Decision tree verified ${tripState.disruption ? 'DISRUPTION PROTOCOL' : 'NOMINAL STATUS'}.`;
      }

      const fallbackMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'vira',
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
      speakText(fallbackMsg.text);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Plane-Shaped Chatbot Floating Trigger (Bottom-Right) */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 rtl:left-6 rtl:right-auto z-40 flex items-center gap-2">
          {/* VYRA Action Pill */}
          {onPopLogo && (
            <button
              id="floating-pop-vira-logo"
              onClick={onPopLogo}
              title="View VYRA Identity & Specifications"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#FAF8F3] hover:bg-white text-[#C2410C] border border-[#DDD6C8] shadow-lg text-xs font-mono font-bold transition-all hover:scale-105 active:scale-95"
            >
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>VYRA</span>
            </button>
          )}

          {/* Main Floating Trigger */}
          <button
            id="vira-floating-trigger"
            onClick={onToggle}
            aria-label="Open VYRA Autonomous Flight Concierge"
            className="flex items-center gap-3 px-4 py-3 rounded-full bg-[#1E2022] hover:bg-[#2C3035] text-white shadow-xl border border-[#DDD6C8]/50 transition-all hover:scale-105 active:scale-95 group relative overflow-hidden"
          >
            {/* Subtle moving flight glow behind button */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C2410C]/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

            {/* Dynamic Moving Plane Icon with Jet Propulsion and Radar Pulse */}
            <div className="relative">
              {/* Outer soft pulse ring */}
              <div className="absolute -inset-1 rounded-full bg-[#C2410C]/25 animate-ping opacity-60" />

              {/* Main Badge Container with hovering elevation */}
              <div className="relative w-9 h-9 rounded-full bg-gradient-to-tr from-[#A33408] via-[#C2410C] to-[#EA580C] flex items-center justify-center text-white shadow-md shadow-[#C2410C]/40 animate-vira-badge">
                {/* Moving Plane Vector: bobbing, banking, and floating */}
                <div className="relative flex items-center justify-center">
                  <Plane className="w-4.5 h-4.5 text-white animate-vira-plane drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]" />
                  
                  {/* Animated Jet Contrail / Thrust Exhaust */}
                  <span className="absolute -bottom-1 -left-1 w-2 h-2 rounded-full bg-amber-400 opacity-80 animate-vira-thrust filter blur-[0.5px]" />
                  <span className="absolute -bottom-2 -left-2 w-1.5 h-1.5 rounded-full bg-orange-300 opacity-60 animate-ping" />
                </div>
              </div>

              {/* Status Beacon */}
              <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FB923C] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FB923C] ring-2 ring-[#1E2022]"></span>
              </span>
            </div>

            <div className="text-left font-display pr-1">
              <div className="text-xs font-bold tracking-wide flex items-center gap-1.5">
                <span className="group-hover:text-[#FB923C] transition-colors">VYRA</span>
                <span className="text-[10px] bg-[#C2410C]/35 text-[#FB923C] font-mono px-1.5 py-0.2 rounded font-semibold border border-[#C2410C]/40">
                  AI OPS
                </span>
              </div>
              <div className="text-[10px] text-[#A6ADB8] font-mono leading-tight flex items-center gap-1 mt-0.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Active Flight Concierge</span>
              </div>
            </div>
          </button>
        </div>
      )}

      {/* VYRA Chat Window Panel */}
      {isOpen && (
        <div 
          id="vira-chat-window"
          className="fixed bottom-6 right-6 rtl:left-6 rtl:right-auto z-50 w-[92vw] sm:w-[420px] h-[580px] max-h-[85vh] bg-[#FAF8F3] rounded-2xl shadow-2xl border-2 border-[#DDD6C8] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200"
        >
          {/* Header in Warm Cream with Moving VYRA Logo Trigger */}
          <div className="bg-[#FAF8F3] border-b border-[#E0D9CB] px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {/* Clickable Moving VYRA Emblem */}
              <button
                onClick={onPopLogo}
                title="Click to view VYRA Identity & System Specifications"
                className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#A33408] via-[#C2410C] to-[#EA580C] hover:opacity-95 flex items-center justify-center text-white shadow-md shadow-[#C2410C]/25 transition-transform hover:scale-105 active:scale-95 group relative animate-vira-badge"
              >
                {/* Moving Plane inside Header Logo */}
                <div className="relative">
                  <Plane className="w-5 h-5 text-white animate-vira-plane drop-shadow-sm" />
                  {/* Subtle propulsion glow */}
                  <span className="absolute -bottom-1 -left-1 w-1.5 h-1.5 rounded-full bg-amber-300 opacity-70 animate-vira-thrust" />
                </div>
                <span className="absolute -bottom-1 -right-1 bg-amber-500 rounded-full p-0.5 text-white shadow-xs">
                  <Sparkles className="w-2.5 h-2.5" />
                </span>
              </button>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-display font-bold text-sm text-[#1E2022]">VYRA</span>
                  <span className="text-[10px] font-mono bg-[#EFEBE1] text-[#C2410C] px-1.5 py-0.2 rounded font-bold border border-[#DDD6C8] flex items-center gap-1">
                    <span>AI OPS</span>
                    <Sparkles className="w-2.5 h-2.5 text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
                  </span>
                </div>
                <div className="text-[10px] text-[#6A717B] font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Autonomous Concierge • Elena Rostova</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Language Selector */}
              <LanguageSelector variant="compact" />

              {/* TTS Readback Toggle */}
              <button
                id="vira-toggle-tts"
                onClick={() => setTtsEnabled(!ttsEnabled)}
                title={ttsEnabled ? "Audio speech synthesis ON" : "Audio speech synthesis MUTED"}
                className={`p-1.5 rounded-md hover:bg-[#EFEBE1] transition-colors ${
                  ttsEnabled ? 'text-amber-600' : 'text-[#8C929A]'
                }`}
              >
                {ttsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              {/* Close Button */}
              <button
                id="vira-close-btn"
                onClick={onToggle}
                className="p-1.5 rounded-md text-[#5A606A] hover:text-[#1E2022] hover:bg-[#EFEBE1] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Current Trip Context Strip in Cream */}
          <div className="bg-[#EFEBE1] px-4 py-1.5 border-b border-[#E0D9CB] text-[11px] font-mono text-[#5A606A] flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <span>Hub: <strong className="text-[#1E2022]">{tripState.activeHub}</strong></span>
              <span>• Buffer: <strong className={tripState.connectionBufferMinutes < 45 ? 'text-red-600' : 'text-[#1E2022]'}>{tripState.connectionBufferMinutes}m</strong></span>
            </div>
            <span className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-[#DDD6C8] text-[#5A606A] font-semibold">
              {tripState.disruption ? 'DISRUPTED' : 'NOMINAL'}
            </span>
          </div>

          {/* Mode Switcher: Conversational Concierge vs Grounded Decision Logs & Historical OTP */}
          <div className="bg-[#FAF8F3] px-3 py-1.5 border-b border-[#E0D9CB] flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 bg-[#EAE5DA] p-1 rounded-lg border border-[#DDD6C8] text-xs font-mono">
              <button
                id="vira-tab-chat"
                onClick={() => setActiveChatTab('chat')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-bold transition-all ${
                  activeChatTab === 'chat'
                    ? 'bg-[#C2410C] text-white shadow-2xs'
                    : 'text-[#5A606A] hover:text-[#1E2022]'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat</span>
              </button>
              <button
                id="vira-tab-logs"
                onClick={() => setActiveChatTab('logs')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-bold transition-all ${
                  activeChatTab === 'logs'
                    ? 'bg-[#C2410C] text-white shadow-2xs'
                    : 'text-[#5A606A] hover:text-[#1E2022]'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>Planner Logs & OTP</span>
                <span className="text-[9px] bg-white/20 px-1 py-0.2 rounded font-mono">
                  {tripState.decisionLogs?.length || 4}
                </span>
              </button>
            </div>

            <div className="text-[10px] font-mono text-[#8C929A] flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-amber-500" />
              <span>Grounded State</span>
            </div>
          </div>

          {/* TAB 1: Chat Messages Body in Soft Cream */}
          {activeChatTab === 'chat' && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#F6F2EA]">
                {messages.map((msg) => {
                  const isVira = msg.sender === 'vira';
                  return (
                    <div
                      key={msg.id}
                      className={`flex items-start gap-2.5 ${isVira ? '' : 'flex-row-reverse'}`}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs ${
                        isVira ? 'bg-[#C2410C] text-white shadow-2xs' : 'bg-[#1E2022] text-white'
                      }`}>
                        {isVira ? <Plane className="w-3 h-3 -rotate-45" /> : <User className="w-3 h-3" />}
                      </div>

                      <div className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                        isVira
                          ? 'bg-white text-[#1E2022] border border-[#E0D9CB] shadow-2xs rounded-tl-sm'
                          : 'bg-[#1E2022] text-white rounded-tr-sm'
                      }`}>
                        <div className="whitespace-pre-wrap">{msg.text}</div>
                        <div className={`text-[9px] font-mono mt-1.5 flex items-center justify-between gap-2 ${isVira ? 'text-[#8C929A]' : 'text-gray-300'}`}>
                          {isVira ? (
                            <button
                              type="button"
                              onClick={() => speakText(msg.text, speechLang)}
                              title={`Listen in ${activeSpeechConfig.nativeName} (${activeSpeechConfig.bcp47})`}
                              className="hover:text-[#C2410C] flex items-center gap-1 font-semibold transition-colors"
                            >
                              <Volume2 className="w-3 h-3" />
                              <span>Listen</span>
                            </button>
                          ) : (
                            <span />
                          )}
                          <span>{msg.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {isLoading && (
                  <div className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-[#C2410C] text-white flex items-center justify-center shrink-0 mt-0.5">
                      <Plane className="w-3 h-3 -rotate-45 animate-spin" />
                    </div>
                    <div className="bg-white border border-[#E0D9CB] rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-xs text-[#6A717B] font-mono flex items-center gap-2 shadow-2xs">
                      <Radio className="w-3.5 h-3.5 text-[#C2410C] animate-pulse" />
                      <span>Synthesizing live trip telemetry & decision logs...</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Rotating Suggested Questions in Cream */}
              <div className="px-3 py-2 bg-[#EFEBE1] border-t border-[#E0D9CB]">
                <div className="flex items-center justify-between mb-1.5 px-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#6A717B] font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#C2410C]" />
                    Suggested Grounded Questions
                  </span>
                  <button
                    id="shuffle-suggestions-btn"
                    onClick={rotateQuestions}
                    title="Shuffle suggested questions"
                    className="text-[10px] font-mono text-[#C2410C] hover:underline flex items-center gap-1 font-bold"
                  >
                    <RotateCcw className="w-2.5 h-2.5" />
                    Rotate
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {suggestedQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(q)}
                      disabled={isLoading}
                      className="text-[11px] text-left px-2.5 py-1 bg-white hover:bg-[#FAF8F3] border border-[#DDD6C8] hover:border-[#C2410C] rounded-lg text-[#1E2022] transition-all line-clamp-1 max-w-full shadow-2xs"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* TAB 2: Grounded Decision Logs & Historical OTP Inspector */}
          {activeChatTab === 'logs' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F6F2EA] text-xs">
              {/* Planner Decision Rationale Card */}
              <div className="bg-white border border-[#E0D9CB] rounded-xl p-3.5 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold font-display text-sm text-[#1E2022]">
                    <TrendingUp className="w-4 h-4 text-[#C2410C]" />
                    <span>Why Planner Selected {tripState.activeHub}</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-[#EFEBE1] text-[#C2410C] px-2 py-0.5 rounded">
                    Score: {tripState.activeHub === 'SIN' ? '94/100' : tripState.activeHub === 'DOH' ? '92/100' : '71/100'}
                  </span>
                </div>

                <p className="text-[11px] text-[#5A606A] leading-relaxed">
                  {tripState.activeHub === 'SIN'
                    ? 'Planner chose Singapore Airlines (SQ305/SQ231) for its 325-minute curfew safety cushion, 91.4% historical on-time arrival rate, and KrisFlyer Solitaire A350/A380 Suites preference.'
                    : tripState.activeHub === 'DOH'
                      ? 'Planner selected Qatar Airways (QR004/QR908) for its industry-leading 94.2% historical OTP, guaranteed solo Qsuite (Seat 2K), and 200-minute buffer before Sydney curfew.'
                      : 'Planner configured Emirates (EK002/EK414) via Dubai for A380 suite luxury and direct lounge boarding, with strict monitoring of its narrow 45m curfew buffer.'}
                </p>

                {/* Quick ask buttons */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <button
                    onClick={() => {
                      setActiveChatTab('chat');
                      handleSendMessage('Why did the Planner choose Singapore over Dubai?');
                    }}
                    className="text-[10px] font-mono font-bold text-[#C2410C] bg-[#FAF8F3] hover:bg-white border border-[#DDD6C8] hover:border-[#C2410C] px-2 py-1 rounded transition-colors"
                  >
                    💬 Ask: Why Singapore over Dubai?
                  </button>
                  <button
                    onClick={() => {
                      setActiveChatTab('chat');
                      handleSendMessage('Why was Dubai rejected despite flying the A380?');
                    }}
                    className="text-[10px] font-mono font-bold text-[#5A606A] hover:text-[#1E2022] bg-[#FAF8F3] hover:bg-white border border-[#DDD6C8] px-2 py-1 rounded transition-colors"
                  >
                    💬 Ask: Why reject Dubai?
                  </button>
                </div>
              </div>

              {/* Historical Flight Performance Benchmark (OTP) */}
              <div className="bg-white border border-[#E0D9CB] rounded-xl p-3.5 shadow-2xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold font-display text-sm text-[#1E2022]">
                    <History className="w-4 h-4 text-emerald-600" />
                    <span>Corridor Historical Telemetry (OTP)</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#8C929A]">Past 90 Days</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center font-mono">
                  {/* SIN */}
                  <div className={`p-2 rounded-lg border text-left ${tripState.activeHub === 'SIN' ? 'bg-[#FAF8F3] border-[#C2410C]' : 'bg-[#F9F8F5] border-[#E0D9CB]'}`}>
                    <div className="text-[10px] font-bold text-[#1E2022] flex items-center justify-between">
                      <span>SIN (SQ)</span>
                      <span className="text-emerald-600">91.4%</span>
                    </div>
                    <div className="text-[9px] text-[#5A606A] mt-1 space-y-0.5">
                      <div>Delay: <strong>11m avg</strong></div>
                      <div>Curfew: <strong>+325m</strong></div>
                      <div>Transit: <strong>14m</strong></div>
                    </div>
                  </div>

                  {/* DOH */}
                  <div className={`p-2 rounded-lg border text-left ${tripState.activeHub === 'DOH' ? 'bg-[#FAF8F3] border-[#C2410C]' : 'bg-[#F9F8F5] border-[#E0D9CB]'}`}>
                    <div className="text-[10px] font-bold text-[#1E2022] flex items-center justify-between">
                      <span>DOH (QR)</span>
                      <span className="text-emerald-600">94.2%</span>
                    </div>
                    <div className="text-[9px] text-[#5A606A] mt-1 space-y-0.5">
                      <div>Delay: <strong>8.8m avg</strong></div>
                      <div>Curfew: <strong>+200m</strong></div>
                      <div>Transit: <strong>18m</strong></div>
                    </div>
                  </div>

                  {/* DXB */}
                  <div className={`p-2 rounded-lg border text-left ${tripState.activeHub === 'DXB' ? 'bg-[#FAF8F3] border-[#C2410C]' : 'bg-[#F9F8F5] border-[#E0D9CB]'}`}>
                    <div className="text-[10px] font-bold text-[#1E2022] flex items-center justify-between">
                      <span>DXB (EK)</span>
                      <span className="text-amber-600">84.1%</span>
                    </div>
                    <div className="text-[9px] text-[#5A606A] mt-1 space-y-0.5">
                      <div>Delay: <strong>28.5m avg</strong></div>
                      <div>Curfew: <strong className="text-red-600">+45m ⚠️</strong></div>
                      <div>Transit: <strong>32m</strong></div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#EFEBE1] p-2 rounded text-[10px] text-[#5A606A] font-mono flex items-center justify-between">
                  <span>Elena Rostova: 8 corridor flights</span>
                  <span className="font-bold text-emerald-700">98.2% Connection Success</span>
                </div>
              </div>

              {/* Previous Agent Decision Logs Timeline */}
              <div className="bg-white border border-[#E0D9CB] rounded-xl p-3.5 shadow-2xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold font-display text-sm text-[#1E2022]">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span>Agent Decision Audit Trail ({tripState.decisionLogs?.length || 0})</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#8C929A]">Autonomous Log</span>
                </div>

                <div className="space-y-2">
                  {tripState.decisionLogs?.map((log) => (
                    <div key={log.id} className="p-2.5 bg-[#FAF8F3] border border-[#E0D9CB] rounded-lg space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-[#1E2022] font-mono">{log.agentName}</span>
                        <span className="text-[9px] text-[#8C929A] font-mono">{log.timestamp}</span>
                      </div>
                      <div className="text-[10px] font-semibold text-[#C2410C] font-mono">{log.action}</div>
                      <div className="text-[11px] text-[#5A606A] leading-tight">{log.primaryRationale}</div>
                      <div className="pt-1 flex items-center justify-between">
                        <span className="text-[9px] font-mono text-[#8C929A]">
                          Confidence: {log.confidenceScore}% • Curfew: +{log.keyFactors.curfewProtectionMinutes}m
                        </span>
                        <button
                          onClick={() => {
                            setActiveChatTab('chat');
                            handleSendMessage(`Explain ${log.agentName} decision log: ${log.action}`);
                          }}
                          className="text-[10px] font-mono text-[#C2410C] hover:underline font-bold"
                        >
                          Ask VYRA →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Speech Language Toolbar & Controls */}
          <div className="px-3 pt-2 pb-1.5 bg-[#FAF8F3] border-t border-[#E0D9CB] flex items-center justify-between gap-2 relative">
            <div className="relative">
              <button
                type="button"
                id="vira-speech-lang-pill"
                onClick={() => setIsSpeechDropdownOpen(!isSpeechDropdownOpen)}
                title="Select Speech Recognition Language (11 Available)"
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white hover:bg-[#F3EFE6] border border-[#DDD6C8] hover:border-[#C2410C] text-[11px] font-mono text-[#1E2022] transition-colors shadow-2xs"
              >
                <span className="text-xs">{activeSpeechConfig.flag}</span>
                <span className="font-bold">{activeSpeechConfig.nativeName}</span>
                <span className="text-[10px] text-[#8C929A]">({activeSpeechConfig.bcp47})</span>
                <ChevronDown className="w-3 h-3 text-[#737A84]" />
              </button>

              {/* 11-Language Dropdown Menu */}
              {isSpeechDropdownOpen && (
                <div 
                  className="absolute bottom-full left-0 mb-1 z-50 w-64 max-h-64 overflow-y-auto bg-white border border-[#DDD6C8] rounded-xl shadow-xl p-1.5 space-y-0.5 animate-fade-in"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="px-2 py-1 text-[10px] font-mono font-bold text-[#8C929A] uppercase tracking-wider border-b border-[#F0EBE1] flex items-center justify-between">
                    <span>11 Speech Locales</span>
                    <Globe className="w-3 h-3 text-[#C2410C]" />
                  </div>
                  {SPEECH_LANGUAGES.map((item) => {
                    const isActive = item.code === speechLang;
                    return (
                      <button
                        key={item.code}
                        type="button"
                        onClick={() => {
                          setSpeechLang(item.code);
                          setIsSpeechDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left text-xs transition-colors ${
                          isActive 
                            ? 'bg-[#FAF0E6] text-[#C2410C] font-bold' 
                            : 'hover:bg-[#FAF8F3] text-[#1E2022]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{item.flag}</span>
                          <div>
                            <div className="text-[11px] leading-tight font-medium">{item.nativeName}</div>
                            <div className="text-[9px] text-[#8C929A] font-mono">{item.bcp47} &bull; {item.name}</div>
                          </div>
                        </div>
                        {isActive && <CheckCircle2 className="w-3.5 h-3.5 text-[#C2410C]" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              {/* TTS Live Indicator / Stop Button */}
              {isSpeaking && (
                <button
                  type="button"
                  onClick={stopSpeaking}
                  title="Stop Audio Playback"
                  className="px-2 py-0.5 rounded bg-amber-100 border border-amber-300 text-amber-900 text-[10px] font-mono font-bold flex items-center gap-1 animate-pulse"
                >
                  <Square className="w-2.5 h-2.5 fill-amber-700" />
                  <span>Speaking... Stop</span>
                </button>
              )}

              {/* 11-Language Voice Commands Guide Modal Trigger */}
              <button
                type="button"
                id="open-voice-guide-btn"
                onClick={() => setIsSpeechModalOpen(true)}
                title="Open 11-Language Speech Recognition & Voice Commands Guide"
                className="flex items-center gap-1 px-2 py-1 rounded-md bg-[#FAF8F3] hover:bg-white text-[#C2410C] border border-[#DDD6C8] hover:border-[#C2410C] text-[10px] font-mono font-bold transition-all shadow-2xs"
              >
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Voice Guide</span>
              </button>
            </div>
          </div>

          {/* Real-time Listening Visualizer Strip */}
          {isListening && (
            <div className="px-3 py-2 bg-red-50/90 border-t border-red-200 flex flex-col gap-1.5 animate-fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                  <span className="text-xs font-bold font-mono text-red-800 flex items-center gap-1.5">
                    <span>{activeSpeechConfig.flag}</span>
                    <span>{activeSpeechConfig.listeningPrompt}</span>
                  </span>
                </div>

                {/* Animated Equalizer Waveform */}
                <div className="flex items-end gap-1 h-4">
                  <span className="w-1 bg-red-500 rounded-full animate-audio-bar-1" />
                  <span className="w-1 bg-red-500 rounded-full animate-audio-bar-2" />
                  <span className="w-1 bg-red-500 rounded-full animate-audio-bar-3" />
                  <span className="w-1 bg-red-500 rounded-full animate-audio-bar-4" />
                  <span className="w-1 bg-red-500 rounded-full animate-audio-bar-5" />
                </div>
              </div>

              {/* Real-time transcription stream */}
              <div className="text-[11px] text-[#1E2022] font-mono bg-white/90 px-2 py-1 rounded border border-red-200">
                {interimTranscript ? (
                  <span className="text-[#1E2022] font-bold">🎙️ &ldquo;{interimTranscript}&rdquo;</span>
                ) : (
                  <span className="text-red-500 italic">Listening for voice in {activeSpeechConfig.nativeName} ({activeSpeechConfig.bcp47})...</span>
                )}
              </div>
            </div>
          )}

          {/* Speech Notice / Permission banner if needed */}
          {speechNotice && !isListening && (
            <div className="px-3 py-1.5 bg-amber-50 border-t border-amber-200 text-[11px] text-amber-900 flex items-center justify-between font-mono animate-fade-in">
              <span className="truncate">{speechNotice}</span>
              <button
                type="button"
                onClick={() => setIsSpeechModalOpen(true)}
                className="text-[#C2410C] font-bold hover:underline shrink-0 ml-2"
              >
                Open Guide →
              </button>
            </div>
          )}

          {/* Input & Speech Controls */}
          <div className="p-3 bg-[#FAF8F3] border-t border-[#E0D9CB]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              {/* Mic / Speech Recognition Button (All 11 Languages) */}
              <button
                type="button"
                id="vira-speech-mic-btn"
                onClick={toggleMic}
                title={
                  isListening
                    ? `Listening in ${activeSpeechConfig.nativeName}... Click to stop`
                    : `Speak in ${activeSpeechConfig.nativeName} (${activeSpeechConfig.bcp47})`
                }
                className={`p-2 rounded-lg border transition-all relative ${
                  isListening
                    ? 'bg-red-600 text-white border-red-700 animate-pulse shadow-md'
                    : 'bg-white text-[#5A606A] border-[#DDD6C8] hover:border-[#C2410C] hover:text-[#C2410C]'
                }`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                {isListening && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 border border-white animate-ping" />
                )}
              </button>

              {/* Text Input */}
              <input
                type="text"
                id="vira-input-field"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  isListening 
                    ? `Listening in ${activeSpeechConfig.nativeName}...` 
                    : `${t.askVira} (${activeSpeechConfig.nativeName})`
                }
                disabled={isLoading}
                className="flex-1 bg-white border border-[#DDD6C8] focus:border-[#C2410C] focus:ring-1 focus:ring-[#C2410C] rounded-lg px-3 py-2 text-xs text-[#1E2022] outline-none transition-all placeholder:text-[#8C929A]"
              />

              {/* Send Button */}
              <button
                type="submit"
                id="vira-send-btn"
                disabled={!inputText.trim() || isLoading}
                className="p-2 rounded-lg bg-[#C2410C] hover:bg-[#A33408] text-white disabled:opacity-50 transition-all shadow-2xs active:scale-95"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 11-Language Speech Recognition & Voice Commands Modal */}
      <SpeechRecognitionModal
        isOpen={isSpeechModalOpen}
        onClose={() => setIsSpeechModalOpen(false)}
        currentSpeechLang={speechLang}
        onSelectSpeechLang={(newLang) => setSpeechLang(newLang)}
        onSendVoiceQuery={(query, langCode) => {
          setSpeechLang(langCode);
          handleSendMessage(query);
        }}
      />
    </>
  );
}

export { ViraChatbot as VyraChatbot };
