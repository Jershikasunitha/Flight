import { useState, useEffect } from 'react';
import { Volume2, VolumeX, Radio, Sparkles } from 'lucide-react';
import { airlineSound } from '../utils/airlineSoundEngine';

interface SoundControlWidgetProps {
  variant?: 'floating' | 'compact' | 'header';
}

export function SoundControlWidget({ variant = 'floating' }: SoundControlWidgetProps) {
  const [isMuted, setIsMuted] = useState(airlineSound.getIsMuted());
  const [volume, setVolume] = useState(airlineSound.getVolume());
  const [isPlaying, setIsPlaying] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  useEffect(() => {
    const unsub = airlineSound.subscribe((muted, vol) => {
      setIsMuted(muted);
      setVolume(vol);
      setIsPlaying(!muted);
    });
    return unsub;
  }, []);

  const handleToggleSound = () => {
    const newMuted = airlineSound.toggleMute();
    setIsMuted(newMuted);
    setIsPlaying(!newMuted);
    if (!newMuted) {
      airlineSound.playAirportChime();
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    airlineSound.setVolume(val);
    if (isMuted && val > 0) {
      airlineSound.toggleMute();
    }
  };

  if (variant === 'compact') {
    return (
      <button
        id="compact-sound-toggle-btn"
        onClick={handleToggleSound}
        className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 border shadow-2xs ${
          !isMuted 
            ? 'bg-[#C2410C] text-white border-[#C2410C]' 
            : 'bg-white text-[#5A606A] border-[#DDD6C8] hover:text-[#1E2022]'
        }`}
        title={!isMuted ? 'Mute Flight Jet Sound' : 'Play Background Flight Sound'}
      >
        {!isMuted ? (
          <>
            <Volume2 className="w-3.5 h-3.5 animate-pulse" />
            <span className="hidden sm:inline">Audio: ON</span>
          </>
        ) : (
          <>
            <VolumeX className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Audio: OFF</span>
          </>
        )}
      </button>
    );
  }

  if (variant === 'header') {
    return (
      <div className="flex items-center gap-1 bg-white border border-[#DDD6C8] rounded-full px-2.5 py-1 shadow-2xs">
        <button
          id="header-sound-toggle-btn"
          onClick={handleToggleSound}
          className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#1E2022] hover:text-[#C2410C] transition-colors"
          title={!isMuted ? 'Mute Jet Engine Sound' : 'Unmute Idle Airline Tycoon Flight Sound'}
        >
          {!isMuted ? (
            <div className="flex items-center gap-1 text-[#C2410C]">
              <Volume2 className="w-3.5 h-3.5" />
              <div className="flex items-end gap-0.5 h-3">
                <span className="w-0.5 bg-[#C2410C] h-2 animate-bounce" style={{ animationDuration: '0.6s' }} />
                <span className="w-0.5 bg-[#C2410C] h-3 animate-bounce" style={{ animationDuration: '0.4s' }} />
                <span className="w-0.5 bg-[#C2410C] h-1.5 animate-bounce" style={{ animationDuration: '0.7s' }} />
              </div>
              <span className="text-[10px] hidden md:inline">Flight Sound ON</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-[#737A84]">
              <VolumeX className="w-3.5 h-3.5" />
              <span className="text-[10px] hidden md:inline">Flight Sound Muted</span>
            </div>
          )}
        </button>

        {!isMuted && (
          <button
            onClick={() => airlineSound.playAirportChime()}
            title="Test Airport Chime"
            className="p-1 hover:bg-[#FAF8F3] rounded text-[#8C929A] hover:text-[#C2410C] transition-colors"
          >
            <Radio className="w-3 h-3" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div 
      id="floating-flight-sound-widget"
      className="fixed bottom-4 left-4 z-40 flex items-center gap-2 bg-white/95 backdrop-blur-md border border-[#DDD6C8] p-1.5 pr-3 rounded-2xl shadow-lg transition-all"
    >
      <button
        id="floating-sound-toggle-btn"
        onClick={handleToggleSound}
        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
          !isMuted 
            ? 'bg-[#C2410C] text-white shadow-xs scale-102' 
            : 'bg-[#F5F1E8] text-[#737A84] hover:text-[#1E2022]'
        }`}
        title={!isMuted ? 'Mute Flight Audio (Idle Airline Tycoon soundscape)' : 'Unmute Background Flight Audio'}
      >
        {!isMuted ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
      </button>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-mono font-bold text-[#1E2022]">
            {!isMuted ? 'Flight Jet Audio' : 'Audio Muted'}
          </span>
          {!isMuted && (
            <div className="flex items-end gap-0.5 h-2.5">
              <span className="w-0.5 bg-[#C2410C] h-2 animate-bounce" style={{ animationDuration: '0.6s' }} />
              <span className="w-0.5 bg-[#C2410C] h-2.5 animate-bounce" style={{ animationDuration: '0.4s' }} />
              <span className="w-0.5 bg-[#C2410C] h-1.5 animate-bounce" style={{ animationDuration: '0.8s' }} />
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 text-[9px] font-mono text-[#737A84]">
          <span>{isMuted ? 'Click to enable jet sound' : `Volume: ${Math.round(volume * 100)}%`}</span>
          {!isMuted && (
            <button
              onClick={() => setShowVolumeSlider(!showVolumeSlider)}
              className="text-[#C2410C] hover:underline"
            >
              {showVolumeSlider ? 'hide' : 'adjust'}
            </button>
          )}
        </div>
      </div>

      {/* Volume slider popout */}
      {!isMuted && showVolumeSlider && (
        <div className="pl-2 border-l border-[#E0D9CB]">
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={handleVolumeChange}
            className="w-16 h-1.5 bg-[#DDD6C8] accent-[#C2410C] rounded-lg cursor-pointer"
          />
        </div>
      )}

      {/* Quick Test Chime button */}
      {!isMuted && (
        <button
          onClick={() => {
            airlineSound.playAirportChime();
          }}
          className="p-1 rounded-lg hover:bg-[#FAF8F3] text-[#8C929A] hover:text-[#C2410C] transition-colors"
          title="Play Airport Chime (Ding-Dong)"
        >
          <Sparkles className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
