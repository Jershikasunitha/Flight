import React, { useState, useEffect } from 'react';
import { 
  X, 
  Mic, 
  MicOff, 
  Volume2, 
  Sparkles, 
  CheckCircle2, 
  Globe, 
  Radio, 
  Plane, 
  ArrowRight,
  Info,
  AlertCircle
} from 'lucide-react';
import { LanguageCode } from '../types/language';
import { SPEECH_LANGUAGES, SpeechLanguageConfig, getSpeechConfig } from '../data/speechRecognitionLanguages';

interface SpeechRecognitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSpeechLang: LanguageCode;
  onSelectSpeechLang: (lang: LanguageCode) => void;
  onSendVoiceQuery: (query: string, langCode: LanguageCode) => void;
}

export function SpeechRecognitionModal({
  isOpen,
  onClose,
  currentSpeechLang,
  onSelectSpeechLang,
  onSendVoiceQuery,
}: SpeechRecognitionModalProps) {
  const [selectedLang, setSelectedLang] = useState<LanguageCode>(currentSpeechLang);
  const [isTestListening, setIsTestListening] = useState(false);
  const [testTranscript, setTestTranscript] = useState('');
  const [browserSpeechSupported, setBrowserSpeechSupported] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);

  useEffect(() => {
    setSelectedLang(currentSpeechLang);
  }, [currentSpeechLang]);

  useEffect(() => {
    const SpeechRecognition = 
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setBrowserSpeechSupported(!!SpeechRecognition);
  }, []);

  if (!isOpen) return null;

  const currentConfig = getSpeechConfig(selectedLang);

  const handleStartTestRecognition = () => {
    setMicError(null);
    setTestTranscript('');

    const SpeechRecognition = 
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setMicError('Web Speech API is not supported in this browser. You can click any sample query below to test voice interaction.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = currentConfig.bcp47;

      recognition.onstart = () => {
        setIsTestListening(true);
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        for (let i = 0; i < event.results.length; i++) {
          interim += event.results[i][0].transcript;
        }
        setTestTranscript(interim);
      };

      recognition.onerror = (event: any) => {
        setIsTestListening(false);
        if (event.error === 'not-allowed') {
          setMicError('Microphone permission was denied. Please allow microphone access in browser settings, or use the sample voice queries below.');
        } else if (event.error === 'no-speech') {
          setMicError('No speech was detected. Please try speaking closer to the microphone.');
        } else {
          setMicError(`Speech recognition notice: ${event.error}. You can test using the sample queries.`);
        }
      };

      recognition.onend = () => {
        setIsTestListening(false);
      };

      recognition.start();
    } catch (err: any) {
      setIsTestListening(false);
      setMicError(err?.message || 'Could not start speech recognition.');
    }
  };

  const handleTestTTS = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.lang = currentConfig.bcp47;
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('TTS error:', err);
    }
  };

  const handleCommitVoiceQuery = (query: string) => {
    onSelectSpeechLang(selectedLang);
    onSendVoiceQuery(query, selectedLang);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
      <div 
        className="bg-[#FAF8F5] border border-[#DDD6C8] rounded-2xl w-full max-w-2xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#1E2022] to-[#2C3035] text-white p-5 flex items-center justify-between border-b border-[#3A3F45]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#A33408] via-[#C2410C] to-[#EA580C] flex items-center justify-center text-white shadow-md">
              <Mic className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold font-display tracking-tight text-white">
                  Multilingual Speech Recognition
                </h3>
                <span className="text-[10px] font-mono bg-[#C2410C] text-white px-2 py-0.5 rounded-full font-bold">
                  11 LANGUAGES
                </span>
              </div>
              <p className="text-xs text-gray-300 font-mono mt-0.5">
                VOYA / VYRA Voice Operations &bull; Dual-direction STT + TTS Engine
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close Speech Recognition Modal"
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Active Language Badge & Live Testing Card */}
          <div className="bg-white border border-[#E0D9CB] rounded-xl p-4 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F0EBE1]">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{currentConfig.flag}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#1E2022]">
                      {currentConfig.nativeName} ({currentConfig.name})
                    </span>
                    <span className="font-mono text-[11px] bg-[#FAF8F3] text-[#C2410C] px-2 py-0.5 rounded border border-[#E0D9CB] font-semibold">
                      Locale: {currentConfig.bcp47}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#737A84] font-mono mt-0.5">
                    {currentConfig.region} &bull; {currentConfig.voiceHint}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleStartTestRecognition}
                  className={`px-3.5 py-2 rounded-lg text-xs font-mono font-bold flex items-center gap-2 shadow-2xs transition-all active:scale-95 ${
                    isTestListening 
                      ? 'bg-red-600 text-white animate-pulse' 
                      : 'bg-[#C2410C] hover:bg-[#A33408] text-white'
                  }`}
                >
                  {isTestListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                  <span>{isTestListening ? 'Listening... Speak Now' : 'Test Speech Recognition'}</span>
                </button>
              </div>
            </div>

            {/* Live Audio Visualizer / Interim Transcript */}
            {isTestListening && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex flex-col gap-2 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                    <span className="text-xs font-bold font-mono text-red-800">
                      {currentConfig.listeningPrompt}
                    </span>
                  </div>
                  {/* Equalizer waves */}
                  <div className="flex items-end gap-1 h-5">
                    <span className="w-1 bg-red-500 rounded-full animate-audio-bar-1" />
                    <span className="w-1 bg-red-500 rounded-full animate-audio-bar-2" />
                    <span className="w-1 bg-red-500 rounded-full animate-audio-bar-3" />
                    <span className="w-1 bg-red-500 rounded-full animate-audio-bar-4" />
                    <span className="w-1 bg-red-500 rounded-full animate-audio-bar-5" />
                  </div>
                </div>
                <div className="text-xs text-[#1E2022] bg-white p-2.5 rounded border border-red-100 min-h-[38px] font-medium">
                  {testTranscript ? (
                    <span>🎙️ &ldquo;{testTranscript}&rdquo;</span>
                  ) : (
                    <span className="text-[#8C929A] italic">Speak your flight query in {currentConfig.nativeName}...</span>
                  )}
                </div>
                {testTranscript && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleCommitVoiceQuery(testTranscript)}
                      className="px-3 py-1 bg-[#1E2022] hover:bg-black text-white text-[11px] font-mono rounded font-bold flex items-center gap-1.5 shadow-2xs"
                    >
                      <span>Send Voice Result to VYRA</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Error or Browser Warning */}
            {micError && (
              <div className="mt-3 p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold">{micError}</div>
                  <div className="text-[11px] text-amber-700 mt-0.5">
                    You can still use or test speech recognition by clicking any sample flight query below.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sample Flight Queries for Current Language */}
          <div className="bg-white border border-[#E0D9CB] rounded-xl p-4 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C2410C]" />
                <h4 className="text-xs font-bold font-mono text-[#1E2022] uppercase tracking-wider">
                  Sample Voice Queries in {currentConfig.nativeName}
                </h4>
              </div>
              <span className="text-[11px] text-[#737A84] font-mono">
                Click to send directly or listen
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentConfig.sampleQueries.map((query, idx) => (
                <div
                  key={idx}
                  className="group flex flex-col justify-between p-3 rounded-lg bg-[#FAF8F3] hover:bg-white border border-[#E0D9CB] hover:border-[#C2410C] transition-all shadow-2xs"
                >
                  <div className="text-xs text-[#1E2022] font-medium leading-snug mb-2">
                    &ldquo;{query}&rdquo;
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-[#EFECE4] text-[11px] font-mono">
                    <button
                      type="button"
                      onClick={() => handleTestTTS(query)}
                      title="Listen to native voice pronunciation"
                      className="text-[#737A84] hover:text-[#C2410C] flex items-center gap-1 font-semibold transition-colors"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Hear</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCommitVoiceQuery(query)}
                      className="text-[#C2410C] hover:underline flex items-center gap-1 font-bold group-hover:translate-x-0.5 transition-transform"
                    >
                      <span>Ask VYRA</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* All 11 Languages Selector Matrix */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#737A84]" />
                <h4 className="text-xs font-bold font-mono text-[#1E2022] uppercase tracking-wider">
                  All 11 Supported Speech Recognition Locales
                </h4>
              </div>
              <span className="text-[11px] font-mono text-[#8C929A]">
                Select to switch speech recognition target
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {SPEECH_LANGUAGES.map((langItem) => {
                const isSelected = selectedLang === langItem.code;
                return (
                  <button
                    key={langItem.code}
                    type="button"
                    onClick={() => {
                      setSelectedLang(langItem.code);
                      onSelectSpeechLang(langItem.code);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all relative ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#FAF0E6] to-[#FFF8F0] border-[#C2410C] shadow-xs ring-1 ring-[#C2410C]'
                        : 'bg-white hover:bg-[#FAF8F3] border-[#E0D9CB] hover:border-[#DDD6C8]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{langItem.flag}</span>
                        <div>
                          <div className="text-xs font-bold text-[#1E2022] flex items-center gap-1">
                            <span>{langItem.nativeName}</span>
                          </div>
                          <div className="text-[10px] text-[#737A84]">
                            {langItem.name}
                          </div>
                        </div>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-[#C2410C]" />
                      )}
                    </div>

                    <div className="mt-2 flex items-center justify-between text-[10px] font-mono pt-1.5 border-t border-[#F0EBE1]">
                      <span className="text-[#8C929A]">BCP-47: {langItem.bcp47}</span>
                      <span className="text-[#C2410C] font-semibold">Ready</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-[#FAF8F3] border-t border-[#E0D9CB] px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 text-xs text-[#5A606A] font-mono">
            <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span>Active Speech Recognition: <strong>{currentConfig.nativeName} ({currentConfig.bcp47})</strong></span>
          </div>

          <div className="flex items-center gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#1E2022] hover:bg-[#2C3035] text-white text-xs font-mono font-bold shadow-2xs transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
